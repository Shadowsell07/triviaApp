'use client';

import { useState, useEffect } from 'react';
import SpaceInvadersBackground from "./SpaceInvadersBackground";
import { supabase } from './supabaseClient';

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
    text: "Which company developed the Windows operating system?",
    answers: [
      { text: "Apple", isCorrect: false },
      { text: "Microsoft", isCorrect: true },
      { text: "IBM", isCorrect: false },
      { text: "Google", isCorrect: false },
    ],
  },
  {
    text: "What does 'HTTP' stand for?",
    answers: [
      { text: "HyperText Transfer Protocol", isCorrect: true },
      { text: "HighText Transfer Protocol", isCorrect: false },
      { text: "HyperText Transmission Program", isCorrect: false },
      { text: "Home Tool Transfer Protocol", isCorrect: false },
    ],
  },
  {
    text: "Which planet is closest to the sun?",
    answers: [
      { text: "Venus", isCorrect: false },
      { text: "Mercury", isCorrect: true },
      { text: "Earth", isCorrect: false },
      { text: "Mars", isCorrect: false },
    ],
  },
  {
    text: "Who is known as the 'Father of Modern Physics'?",
    answers: [
      { text: "Isaac Newton", isCorrect: false },
      { text: "Albert Einstein", isCorrect: true },
      { text: "Galileo Galilei", isCorrect: false },
      { text: "Niels Bohr", isCorrect: false },
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
    text: "Which U.S. city is known as the 'Windy City'?",
    answers: [
      { text: "New York", isCorrect: false },
      { text: "Chicago", isCorrect: true },
      { text: "Los Angeles", isCorrect: false },
      { text: "San Francisco", isCorrect: false },
    ],
  },
  {
    text: "What is the chemical symbol for potassium?",
    answers: [
      { text: "K", isCorrect: true },
      { text: "P", isCorrect: false },
      { text: "Pt", isCorrect: false },
      { text: "Po", isCorrect: false },
    ],
  },
  {
    text: "Which device is used to measure atmospheric pressure?",
    answers: [
      { text: "Thermometer", isCorrect: false },
      { text: "Barometer", isCorrect: true },
      { text: "Hygrometer", isCorrect: false },
      { text: "Anemometer", isCorrect: false },
    ],
  },
  {
    text: "Who is the author of the Harry Potter series?",
    answers: [
      { text: "J.K. Rowling", isCorrect: true },
      { text: "J.R.R. Tolkien", isCorrect: false },
      { text: "Stephen King", isCorrect: false },
      { text: "Suzanne Collins", isCorrect: false },
    ],
  },
  {
    text: "What is the largest continent by area?",
    answers: [
      { text: "Africa", isCorrect: false },
      { text: "Asia", isCorrect: true },
      { text: "Europe", isCorrect: false },
      { text: "North America", isCorrect: false },
    ],
  },
  {
    text: "Which year did the first man land on the moon?",
    answers: [
      { text: "1969", isCorrect: true },
      { text: "1972", isCorrect: false },
      { text: "1959", isCorrect: false },
      { text: "1965", isCorrect: false },
    ],
  },
  {
    text: "What is the largest internal organ in the human body?",
    answers: [
      { text: "Liver", isCorrect: true },
      { text: "Heart", isCorrect: false },
      { text: "Lung", isCorrect: false },
      { text: "Kidney", isCorrect: false },
    ],
  },
  {
    text: "Which company is known for the iPhone?",
    answers: [
      { text: "Apple", isCorrect: true },
      { text: "Samsung", isCorrect: false },
      { text: "Google", isCorrect: false },
      { text: "Microsoft", isCorrect: false },
    ],
  },
  {
    text: "What is the freezing point of water in Celsius?",
    answers: [
      { text: "0", isCorrect: true },
      { text: "32", isCorrect: false },
      { text: "100", isCorrect: false },
      { text: "-10", isCorrect: false },
    ],
  },
  {
    text: "Who was the first President of the United States?",
    answers: [
      { text: "George Washington", isCorrect: true },
      { text: "Abraham Lincoln", isCorrect: false },
      { text: "Thomas Jefferson", isCorrect: false },
      { text: "John Adams", isCorrect: false },
    ],
  },
  {
    text: "Which element is needed for the production of nuclear energy and weapons?",
    answers: [
      { text: "Uranium", isCorrect: true },
      { text: "Gold", isCorrect: false },
      { text: "Silver", isCorrect: false },
      { text: "Copper", isCorrect: false },
    ],
  },
  {
    text: "What is the main language spoken in Brazil?",
    answers: [
      { text: "Portuguese", isCorrect: true },
      { text: "Spanish", isCorrect: false },
      { text: "French", isCorrect: false },
      { text: "English", isCorrect: false },
    ],
  },
  {
    text: "Which is the smallest US state by area?",
    answers: [
      { text: "Rhode Island", isCorrect: true },
      { text: "Delaware", isCorrect: false },
      { text: "Connecticut", isCorrect: false },
      { text: "Vermont", isCorrect: false },
    ],
  },
  {
    text: "What is the process by which plants make their food?",
    answers: [
      { text: "Photosynthesis", isCorrect: true },
      { text: "Respiration", isCorrect: false },
      { text: "Transpiration", isCorrect: false },
      { text: "Fermentation", isCorrect: false },
    ],
  },
  {
    text: "Who is the CEO of Tesla as of 2025?",
    answers: [
      { text: "Elon Musk", isCorrect: true },
      { text: "Tim Cook", isCorrect: false },
      { text: "Jeff Bezos", isCorrect: false },
      { text: "Sundar Pichai", isCorrect: false },
    ],
  },
  {
    text: "Which country is home to the kangaroo?",
    answers: [
      { text: "Australia", isCorrect: true },
      { text: "India", isCorrect: false },
      { text: "South Africa", isCorrect: false },
      { text: "Canada", isCorrect: false },
    ],
  },
  {
    text: "What is the boiling point of water in Celsius?",
    answers: [
      { text: "100", isCorrect: true },
      { text: "0", isCorrect: false },
      { text: "50", isCorrect: false },
      { text: "212", isCorrect: false },
    ],
  },
  {
    text: "Which instrument measures earthquakes?",
    answers: [
      { text: "Seismograph", isCorrect: true },
      { text: "Barometer", isCorrect: false },
      { text: "Thermometer", isCorrect: false },
      { text: "Hygrometer", isCorrect: false },
    ],
  },
  {
    text: "What is the largest planet in our solar system?",
    answers: [
      { text: "Jupiter", isCorrect: true },
      { text: "Saturn", isCorrect: false },
      { text: "Earth", isCorrect: false },
      { text: "Mars", isCorrect: false },
    ],
  },
  {
    text: "Who wrote the novel '1984'?",
    answers: [
      { text: "George Orwell", isCorrect: true },
      { text: "Aldous Huxley", isCorrect: false },
      { text: "Ray Bradbury", isCorrect: false },
      { text: "J.D. Salinger", isCorrect: false },
    ],
  },
  {
    text: "Which continent has the most countries?",
    answers: [
      { text: "Africa", isCorrect: true },
      { text: "Asia", isCorrect: false },
      { text: "Europe", isCorrect: false },
      { text: "South America", isCorrect: false },
    ],
  },
  {
    text: "What is the main currency of Japan?",
    answers: [
      { text: "Yen", isCorrect: true },
      { text: "Won", isCorrect: false },
      { text: "Dollar", isCorrect: false },
      { text: "Euro", isCorrect: false },
    ],
  },
  {
    text: "Which company owns YouTube?",
    answers: [
      { text: "Google", isCorrect: true },
      { text: "Facebook", isCorrect: false },
      { text: "Amazon", isCorrect: false },
      { text: "Apple", isCorrect: false },
    ],
  },
  {
    text: "What is the capital city of Canada?",
    answers: [
      { text: "Toronto", isCorrect: false },
      { text: "Ottawa", isCorrect: true },
      { text: "Vancouver", isCorrect: false },
      { text: "Montreal", isCorrect: false },
    ],
  },
  {
    text: "Which scientist developed the theory of relativity?",
    answers: [
      { text: "Albert Einstein", isCorrect: true },
      { text: "Isaac Newton", isCorrect: false },
      { text: "Marie Curie", isCorrect: false },
      { text: "Nikola Tesla", isCorrect: false },
    ],
  },
  {
    text: "What is the largest bone in the human body?",
    answers: [
      { text: "Femur", isCorrect: true },
      { text: "Tibia", isCorrect: false },
      { text: "Humerus", isCorrect: false },
      { text: "Skull", isCorrect: false },
    ],
  },
];

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
