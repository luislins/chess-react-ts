import { useEffect, useRef, useState } from "react";
import Square from "./Square";

type SquareProps = {
  position: string;
  color: string;
};

function Board() {
  const boardRef = useRef<HTMLDivElement>(null);
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
    const board = boardRef.current;
    if (activePiece && board) {
      const minX = board.offsetLeft - 25;
      const minY = board.offsetTop - 25;

      const maxX = board.clientHeight + board.offsetLeft - 75;
      const maxY = board.clientWidth;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      // Minimo
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }
  // const xCoord = [8, 7, 6, 5, 4, 3, 2, 1];
  // const yCoord = ["a", "b", "c", "d", "e", "f", "g", "h"];

  function dropPiece(e: React.MouseEvent) {
    const board = boardRef.current;
    if (activePiece && board) {
      activePiece = null;
    }
  }

  return (
    <div
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      className="board"
      id="board"
      ref={boardRef}
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
