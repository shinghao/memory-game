import { useState, useEffect, useCallback } from "react";
import Cell from "./Cell";

const emojis = [
  "🐵",
  "🐶",
  "🦊",
  "🐱",
  "🦁",
  "🐯",
  "🐴",
  "🦄",
  "🦓",
  "🦌",
  "🐮",
  "🐷",
  "🐭",
  "🐹",
  "🐻",
  "🐨",
  "🐼",
  "🐽",
  "🐸",
  "🐰",
  "🐙",
];

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

const generateBoard = (pairCount) => {
  const selectedEmojis = shuffle(emojis).slice(0, pairCount);
  return shuffle([...selectedEmojis, ...selectedEmojis]);
};

export default function MemoryGame({ pairCount = 8, waitTime = 1000 }) {
  const [board, setBoard] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(null);

  const onReset = useCallback(() => {
    setBoard(generateBoard(pairCount));
    setFlipped([]);
    setMatched([]);
    setIsGameOver(false);
    setCount(0);
  }, [pairCount]);

  useEffect(() => {
    onReset();
  }, [pairCount, onReset]);

  const onCorrectMatch = (index) => {
    const newMatched = [...matched, board[index]];
    setFlipped([]);
    setMatched(newMatched);
    setIsGameOver(newMatched.length === pairCount);
  };

  const onWrongMatch = () => {
    setTimer(
      setTimeout(() => {
        setFlipped([]);
        setTimer(null);
      }, waitTime)
    );
  };

  const onFlip = (index) => {
    const newFlipped = timer ? [index] : [...flipped, index];
    setFlipped(newFlipped);

    if (timer !== null) {
      clearTimeout(timer);
      setTimer(null);
    }

    if (newFlipped.length < 2) {
      return;
    }

    setCount((count) => count + 1);

    const isMatched = board[newFlipped[0]] === board[newFlipped[1]];
    isMatched ? onCorrectMatch(index) : onWrongMatch();
  };

  return (
    <div className="game">
      <h1>🐹 Memory Game 🐶</h1>
      {isGameOver && <span className="win-message">You win! 🎉</span>}
      <span>Flips: {count}</span>
      {
        <div className="board">
          {board.map((val, index) => (
            <Cell
              val={val}
              index={index}
              key={index}
              onFlip={onFlip}
              isSelected={flipped.includes(index)}
              isMatched={matched.includes(val)}
            />
          ))}
        </div>
      }
      {isGameOver && (
        <button className="reset-button" onClick={onReset}>
          Play Again
        </button>
      )}
    </div>
  );
}
