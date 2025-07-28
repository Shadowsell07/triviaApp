"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import SpaceInvadersBackground from '../../SpaceInvadersBackground';
import { v4 as uuidv4 } from 'uuid';
import { questions, Question, Answer } from '../../questions';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function LobbyPage({ params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId;
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [lobby, setLobby] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ [player: string]: number[] }>({});
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([]);

  // Fetch lobby for this session and subscribe to changes
  useEffect(() => {
    let ignore = false;
    async function fetchLobby() {
      const { data } = await supabase.from('lobby').select('name').eq('session_id', sessionId).order('joined_at');
      if (!ignore && data) setLobby(data.map((row: any) => row.name));
    }
    fetchLobby();
    const channel = supabase
      .channel('lobby-changes-' + sessionId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lobby', filter: `session_id=eq.${sessionId}` }, payload => {
        fetchLobby();
      })
      .subscribe();
    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  // Join lobby (insert into Supabase)
  const handleJoinLobby = async () => {
    const trimmed = nameInput.trim();
    if (trimmed && !lobby.includes(trimmed)) {
      await supabase.from('lobby').insert([{ name: trimmed, session_id: sessionId }]);
      setPlayerName(trimmed);
      setAnswers(a => ({ ...a, [trimmed]: [] }));
      setLobby(prev => [...prev, trimmed]);
    }
  };

  // Fetch or create shuffled question indices for this session
  async function getOrCreateSessionQuestions(sessionId: string, numQuestions: number): Promise<Question[]> {
    const { data, error } = await supabase
      .from('session_questions')
      .select('question_indices')
      .eq('session_id', sessionId)
      .single();

    let indices: number[];
    if (data && data.question_indices && data.question_indices.length === numQuestions) {
      indices = data.question_indices;
    } else {
      // If not found or wrong length, create a new shuffled set and upsert
      indices = shuffle(Array.from({ length: questions.length }, (_, i) => i)).slice(0, numQuestions);
      // Upsert: delete old, insert new
      await supabase.from('session_questions').delete().eq('session_id', sessionId);
      await supabase.from('session_questions').insert([
        { session_id: sessionId, question_indices: indices }
      ]);
    }
    return indices.map(i => questions[i]);
  }

  // When game starts, fetch or create the session's question set
  useEffect(() => {
    if (gameStarted) {
      getOrCreateSessionQuestions(sessionId, 20).then(setRandomizedQuestions);
    }
  }, [gameStarted, sessionId]);

  // Add missing handlers for question navigation
  const handleAnswerClick = (index: number) => {
    if (!isTimerRunning) return;
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers(a => ({
        ...a,
        [playerName]: [...(a[playerName] || []), selectedAnswer]
      }));
      if (randomizedQuestions[currentQuestion].answers[selectedAnswer].isCorrect) {
        setScore(score + 1);
      }
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setTimeLeft(10);
    setIsTimerRunning(true);
  };

  // Show game UI if game has started and questions are loaded
  if (gameStarted && randomizedQuestions.length > 0) {
    if (currentQuestion >= randomizedQuestions.length) {
      // Calculate all scores
      const allScores = Object.entries(answers).map(([name, ans]) => {
        let s = 0;
        for (let i = 0; i < ans.length; i++) {
          if (randomizedQuestions[i] && randomizedQuestions[i].answers[ans[i]]?.isCorrect) s++;
        }
        return { name, score: s };
      });
      allScores.sort((a, b) => b.score - a.score);
      return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <SpaceInvadersBackground />
          <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center relative z-10">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <div className="mb-4 text-lg font-semibold">Scores:</div>
            <ul className="mb-4">
              {allScores.map((p, i) => (
                <li key={i} className={p.name === playerName ? 'font-bold text-blue-600' : ''}>
                  {i + 1}. {p.name}: {p.score} / {randomizedQuestions.length}
                </li>
              ))}
            </ul>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <SpaceInvadersBackground />
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-2xl relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-semibold">
              Question {currentQuestion + 1}/{randomizedQuestions.length}
            </div>
            <div className="text-lg font-semibold">
              Time: {timeLeft}s
            </div>
          </div>
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold">{randomizedQuestions[currentQuestion].text}</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {randomizedQuestions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={`p-4 text-left rounded-lg transition-colors ${
                  selectedAnswer === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {answer.text}
              </button>
            ))}
          </div>
          {(selectedAnswer !== null || !isTimerRunning) && (
            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SpaceInvadersBackground />
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md text-center relative z-10">
        <h2 className="text-2xl font-bold mb-4">Enter Your Name to Join</h2>
        <input
          type="text"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          placeholder="Your name"
          maxLength={20}
          disabled={gameStarted}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2 disabled:opacity-50"
          disabled={!nameInput.trim() || lobby.includes(nameInput.trim())}
          onClick={handleJoinLobby}
        >
          Join Lobby
        </button>
        {/* ...rest of your lobby/game UI... */}
      </div>
    </div>
  );
}
