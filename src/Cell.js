export default function Cell({ val, index, onFlip, isSelected, isMatched }) {
  return (
    <button
      className="board-cell"
      onClick={() => onFlip(index)}
      disabled={isMatched}
    >
      {(isSelected || isMatched) && val}
    </button>
  );
}
