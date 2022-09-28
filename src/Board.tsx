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
          color: getCor(i, j),
        });
      }
    }
    setSquares(array);
  }, []);

  function getCor(i: number, j: number) {
    if (i % 2 == 0) {
      return j % 2 == 0 ? "white" : "black";
    } else {
      return j % 2 == 0 ? "black" : "white";
    }
  }

  return (
    <div className="board">
      {squares?.map((square, i) => (
        <div key={square.position}>
          <Square position={square.position} color={square.color} />
        </div>
      ))}
    </div>
  );
}

export default Board;
