'use client';

import { useState, useEffect } from 'react';
import SpaceInvadersBackground from "./SpaceInvadersBackground";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  answers: Answer[];
}

// Sample questions - these would typically come from an API or database
const questions: Question[] = [
  {
    text: "What is the capital of France?",
    answers: [
      { text: "London", isCorrect: false },
      { text: "Berlin", isCorrect: false },
      { text: "Paris", isCorrect: true },
      { text: "Madrid", isCorrect: false },
    ],
  },
  {
    text: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Earth", isCorrect: false },
      { text: "Mars", isCorrect: true },
      { text: "Jupiter", isCorrect: false },
      { text: "Venus", isCorrect: false },
    ],
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    answers: [
      { text: "William Shakespeare", isCorrect: true },
      { text: "Charles Dickens", isCorrect: false },
      { text: "Jane Austen", isCorrect: false },
      { text: "Mark Twain", isCorrect: false },
    ],
  },
  {
    text: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", isCorrect: false },
      { text: "Indian Ocean", isCorrect: false },
      { text: "Arctic Ocean", isCorrect: false },
      { text: "Pacific Ocean", isCorrect: true },
    ],
  },
  {
    text: "What is the chemical symbol for gold?",
    answers: [
      { text: "Au", isCorrect: true },
      { text: "Ag", isCorrect: false },
      { text: "Gd", isCorrect: false },
      { text: "Go", isCorrect: false },
    ],
  },
  {
    text: "Who painted the Mona Lisa?",
    answers: [
      { text: "Leonardo da Vinci", isCorrect: true },
      { text: "Vincent van Gogh", isCorrect: false },
      { text: "Pablo Picasso", isCorrect: false },
      { text: "Claude Monet", isCorrect: false },
    ],
  },
  {
    text: "What is the smallest prime number?",
    answers: [
      { text: "1", isCorrect: false },
      { text: "2", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "5", isCorrect: false },
    ],
  },
  {
    text: "Which country hosted the 2016 Summer Olympics?",
    answers: [
      { text: "China", isCorrect: false },
      { text: "Brazil", isCorrect: true },
      { text: "UK", isCorrect: false },
      { text: "Russia", isCorrect: false },
    ],
  },
  {
    text: "What is the hardest natural substance?",
    answers: [
      { text: "Gold", isCorrect: false },
      { text: "Iron", isCorrect: false },
      { text: "Diamond", isCorrect: true },
      { text: "Silver", isCorrect: false },
    ],
  },
  {
    text: "Who discovered penicillin?",
    answers: [
      { text: "Alexander Fleming", isCorrect: true },
      { text: "Marie Curie", isCorrect: false },
      { text: "Isaac Newton", isCorrect: false },
      { text: "Albert Einstein", isCorrect: false },
    ],
  },
  {
    text: "What is the largest mammal?",
    answers: [
      { text: "Elephant", isCorrect: false },
      { text: "Blue Whale", isCorrect: true },
      { text: "Giraffe", isCorrect: false },
      { text: "Hippopotamus", isCorrect: false },
    ],
  },
  {
    text: "Which language has the most native speakers?",
    answers: [
      { text: "English", isCorrect: false },
      { text: "Mandarin Chinese", isCorrect: true },
      { text: "Spanish", isCorrect: false },
      { text: "Hindi", isCorrect: false },
    ],
  },
  {
    text: "What is the square root of 64?",
    answers: [
      { text: "6", isCorrect: false },
      { text: "8", isCorrect: true },
      { text: "7", isCorrect: false },
      { text: "9", isCorrect: false },
    ],
  },
  {
    text: "Who is known as the father of computers?",
    answers: [
      { text: "Charles Babbage", isCorrect: true },
      { text: "Alan Turing", isCorrect: false },
      { text: "Bill Gates", isCorrect: false },
      { text: "Steve Jobs", isCorrect: false },
    ],
  },
  {
    text: "Which element has the atomic number 1?",
    answers: [
      { text: "Oxygen", isCorrect: false },
      { text: "Hydrogen", isCorrect: true },
      { text: "Helium", isCorrect: false },
      { text: "Carbon", isCorrect: false },
    ],
  },
  {
    text: "What is the tallest mountain in the world?",
    answers: [
      { text: "K2", isCorrect: false },
      { text: "Mount Everest", isCorrect: true },
      { text: "Kangchenjunga", isCorrect: false },
      { text: "Lhotse", isCorrect: false },
    ],
  },
  {
    text: "Which continent is the Sahara Desert located on?",
    answers: [
      { text: "Asia", isCorrect: false },
      { text: "Africa", isCorrect: true },
      { text: "Australia", isCorrect: false },
      { text: "South America", isCorrect: false },
    ],
  },
  {
    text: "Who invented the telephone?",
    answers: [
      { text: "Alexander Graham Bell", isCorrect: true },
      { text: "Thomas Edison", isCorrect: false },
      { text: "Nikola Tesla", isCorrect: false },
      { text: "Guglielmo Marconi", isCorrect: false },
    ],
  },
  {
    text: "What is the main ingredient in guacamole?",
    answers: [
      { text: "Tomato", isCorrect: false },
      { text: "Avocado", isCorrect: true },
      { text: "Onion", isCorrect: false },
      { text: "Pepper", isCorrect: false },
    ],
  },
  {
    text: "Which gas do plants absorb from the atmosphere?",
    answers: [
      { text: "Oxygen", isCorrect: false },
      { text: "Carbon Dioxide", isCorrect: true },
      { text: "Nitrogen", isCorrect: false },
      { text: "Hydrogen", isCorrect: false },
    ],
  },
];

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
            onClick={() => {
              const trimmed = nameInput.trim();
              if (trimmed && !lobby.includes(trimmed)) {
                setPlayerName(trimmed);
                setLobby([...lobby, trimmed]);
                setAnswers(a => ({ ...a, [trimmed]: [] }));
              }
            }}
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
      if (questions[currentQuestion].answers[selectedAnswer].isCorrect) {
        setScore(score + 1);
      }
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setTimeLeft(10);
    setIsTimerRunning(true);
  };

  if (currentQuestion >= questions.length) {
    // Calculate all scores
    const allScores = Object.entries(answers).map(([name, ans]) => {
      let s = 0;
      for (let i = 0; i < ans.length; i++) {
        if (questions[i] && questions[i].answers[ans[i]]?.isCorrect) s++;
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
                {i + 1}. {p.name}: {p.score} / {questions.length}
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
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="text-lg font-semibold">
            Time: {timeLeft}s
          </div>
        </div>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold">{questions[currentQuestion].text}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].answers.map((answer, index) => (
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
