import { useState, useEffect, useRef } from 'react';
import { words } from './words';
import './App.css'; // Оставим базовые стили Vite, но наши будут в App.css

export default function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, result
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [usedWords, setUsedWords] = useState([]);
  const timerRef = useRef(null);

  // Логика таймера
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  const getRandomWord = () => {
    let availableWords = words.filter(w => !usedWords.includes(w));
    if (availableWords.length === 0) {
      setUsedWords([]); // Сброс, если слова кончились
      availableWords = words;
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const newWord = availableWords[randomIndex];
    setCurrentWord(newWord);
    setUsedWords(prev => [...prev, newWord]);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setUsedWords([]);
    getRandomWord();
  };

  const handleCorrect = () => {
    setScore(prev => prev + 1);
    getRandomWord();
  };

  const handleSkip = () => {
    getRandomWord();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Экраны
  if (gameState === 'start') {
    return (
      <div className="screen">
        <h1>Элиас: Информатика</h1>
        <p>Объясни слово, не называя его!</p>
        <button className="btn primary" onClick={startGame}>Начать игру</button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="screen">
        <h1>Время вышло!</h1>
        <h2>Ваш счет: {score}</h2>
        <button className="btn primary" onClick={startGame}>Играть снова</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="header">
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="score">Счет: {score}</div>
      </div>
      
      <div className="card">
        <h1>{currentWord}</h1>
      </div>

      <div className="controls">
        <button className="btn danger" onClick={handleSkip}>Пропустить</button>
        <button className="btn success" onClick={handleCorrect}>Угадали!</button>
      </div>
    </div>
  );
}