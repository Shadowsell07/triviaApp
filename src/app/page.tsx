'use client';

import { useState, useEffect } from 'react';
import SpaceInvadersBackground from "./SpaceInvadersBackground";
import { supabase } from './supabaseClient';
import { questions, Question, Answer } from './questions';


// Shared in-memory question set for the current game session
let sharedShuffledQuestions: Question[] | null = null;

// Shuffle function
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Home() {
  // All hooks at the top
  const [playerName, setPlayerName] = useState<string>("");
  const [nameInput, setNameInput] = useState<string>("");
  const [lobby, setLobby] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ [player: string]: number[] }>({});
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([]);

  // When game starts, use shared questions if available
  useEffect(() => {
    if (gameStarted && sharedShuffledQuestions) {
      setRandomizedQuestions(sharedShuffledQuestions);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsTimerRunning(false);
      return;
    }

    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  // Fetch lobby on mount and subscribe to changes
  useEffect(() => {
    let ignore = false;
    async function fetchLobby() {
      const { data } = await supabase.from('lobby').select('name').order('joined_at');
      if (!ignore && data) setLobby(data.map((row: any) => row.name));
    }
    fetchLobby();
    // Real-time subscription
    const channel = supabase
      .channel('lobby-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lobby' }, payload => {
        fetchLobby();
      })
      .subscribe();
    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // Join lobby (insert into Supabase)
  const handleJoinLobby = async () => {
    const trimmed = nameInput.trim();
    if (trimmed && !lobby.includes(trimmed)) {
      await supabase.from('lobby').insert([{ name: trimmed }]);
      setPlayerName(trimmed);
      setAnswers(a => ({ ...a, [trimmed]: [] }));
      // Optimistically add to lobby for instant feedback
      setLobby(prev => [...prev, trimmed]);
    }
  };

  // Lobby: Enter name and join
  if (!playerName && !gameStarted) {
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
        </div>
      </div>
    );
  }

  // Show lobby for joined players until game starts
  if (playerName && !gameStarted) {
    const handleStartGame = () => {
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setTimeLeft(10);
      setIsTimerRunning(true);
      setScore(0);
      // Only shuffle and set shared questions if not already set
      if (!sharedShuffledQuestions) {
        sharedShuffledQuestions = shuffle(questions).slice(0, 20);
      }
      setRandomizedQuestions(sharedShuffledQuestions);
      setGameStarted(true);
    };
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <SpaceInvadersBackground />
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md text-center relative z-10">
          <h2 className="text-2xl font-bold mb-4">Waiting in Lobby</h2>
          <div className="mb-4">Share this link with your team. When everyone has joined, click Start Game.</div>
          <div className="text-left mb-4">
            <div className="font-semibold mb-2">Players in Lobby:</div>
            <ul>
              {lobby.map((name, i) => (
                <li key={i} className={name === playerName ? 'font-bold text-blue-600' : 'text-gray-700'}>{name}</li>
              ))}
            </ul>
          </div>
          <button
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            disabled={lobby.length < 1}
            onClick={handleStartGame}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

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
  )
}
