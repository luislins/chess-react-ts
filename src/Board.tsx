import { useEffect, useState } from "react";
import Square from "./Square";

type SquareProps = {
  position: string;
  color: string;
};

function Board() {
  const tamanho = 8;
  const xCoord = [8, 7, 6, 5, 4, 3, 2, 1];
  const yCoord = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const [squares, setSquares] = useState<SquareProps[]>();

  useEffect(() => {
    let array = [];
    for (let i = 0; i < tamanho; i++) {
      for (let j = 0; j < tamanho; j++) {
        array.push({
          position: yCoord[j] + xCoord[i],
          color: i % 2 == j % 2 ? "#ebecd0" : "#779556",
        });
      }
    }
    setSquares(array);
  }, []);
  let activePiece: HTMLElement | null = null;

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    if (element.classList.contains("piece")) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.top = `${y}px`;
      element.style.left = `${x}px`;

      activePiece = element;
    }
  }

  function movePiece(e: React.MouseEvent) {
    if (activePiece) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";
      activePiece.style.top = `${y}px`;
      activePiece.style.left = `${x}px`;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    if (activePiece) {
      activePiece = null;
    }
  }

  return (
    <div
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      className="board"
    >
      {squares?.map((square, i) => (
        <Square
          key={square.position}
          position={square.position}
          color={square.color}
        />
      ))}
    </div>
  );
}

export default Board;
