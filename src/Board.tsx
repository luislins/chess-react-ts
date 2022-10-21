import { useEffect, useState } from "react";
import { COLORS } from "./colors";
import Square from "./Square";

type SquareProps = {
  x: number;
  y: number;
  backgroundColor: string;
  piece: string | undefined;
  pieceColor: string | undefined;
};

const initialPiecePositionMap = new Map<string, string>();
//White
initialPiecePositionMap.set("00", "rook");
initialPiecePositionMap.set("01", "horse");
initialPiecePositionMap.set("02", "bishop");
initialPiecePositionMap.set("03", "queen");
initialPiecePositionMap.set("04", "king");
initialPiecePositionMap.set("05", "bishop");
initialPiecePositionMap.set("06", "horse");
initialPiecePositionMap.set("07", "rook");
initialPiecePositionMap.set("10", "pawn");
initialPiecePositionMap.set("11", "pawn");
initialPiecePositionMap.set("12", "pawn");
initialPiecePositionMap.set("13", "pawn");
initialPiecePositionMap.set("14", "pawn");
initialPiecePositionMap.set("15", "pawn");
initialPiecePositionMap.set("16", "pawn");
initialPiecePositionMap.set("17", "pawn");

//Black
initialPiecePositionMap.set("60", "pawn");
initialPiecePositionMap.set("61", "pawn");
initialPiecePositionMap.set("62", "pawn");
initialPiecePositionMap.set("63", "pawn");
initialPiecePositionMap.set("64", "pawn");
initialPiecePositionMap.set("65", "pawn");
initialPiecePositionMap.set("66", "pawn");
initialPiecePositionMap.set("67", "pawn");
initialPiecePositionMap.set("70", "rook");
initialPiecePositionMap.set("71", "horse");
initialPiecePositionMap.set("72", "bishop");
initialPiecePositionMap.set("73", "queen");
initialPiecePositionMap.set("74", "king");
initialPiecePositionMap.set("75", "bishop");
initialPiecePositionMap.set("76", "horse");
initialPiecePositionMap.set("77", "rook");

function Board() {
  const tamanho = 8;
  let activeSquare: HTMLElement | null = null;
  const [squares, setSquares] = useState<SquareProps[]>([]);
  useEffect(() => {
    let board = [];
    for (let i = 0; i < tamanho; i++) {
      for (let j = 0; j < tamanho; j++) {
        board.push({
          x: i,
          y: j,
          backgroundColor:
            i % 2 == j % 2
              ? COLORS.light_square_green
              : COLORS.dark_square_green,
          piece: getPiece(i, j),
          pieceColor: getPieceColor(i, j),
        });
      }
    }
    setSquares(board);
  }, []);

  function getPiece(x: number, y: number) {
    return initialPiecePositionMap.get(x + "" + y);
  }

  function getPieceColor(x: number, y: number) {
    if (x <= 1) {
      return "black";
    } else if (x >= 6) {
      return "white";
    }
  }

  function canMovePiece(
    arrayAux: SquareProps[],
    positionBefore: string,
    positionAfter: string,
    pieceBefore: string
  ) {
    const squareBeforeObj = arrayAux[Number(positionBefore)];
    const squareAfterObj = arrayAux[Number(positionAfter)];
    const color = squareBeforeObj.pieceColor;

    if (
      squareBeforeObj.pieceColor &&
      squareAfterObj.pieceColor &&
      squareBeforeObj.pieceColor == squareAfterObj.pieceColor
    ) {
      return false;
    }
    if (pieceBefore == "pawn") {
      if (squareAfterObj.y != squareBeforeObj.y) {
        return false;
      }

      //Direction
      if (color == "black") {
        if (squareAfterObj.x < squareBeforeObj.x) {
          return false;
        }
      } else if (color == "white") {
        if (squareAfterObj.x > squareBeforeObj.x) {
          return false;
        }
      }
    } else if (pieceBefore == "rook") {
      let validPositionsHook = [];
      let startX = squareBeforeObj.x;
      let startY = squareBeforeObj.y;
      for (let i = 0; i < 8; i++) {
        validPositionsHook.push(startX + "" + (startY + i));
        validPositionsHook.push(startX + i + "" + startY);
        validPositionsHook.push(startX + "" + Math.abs(startY - i));
        validPositionsHook.push(Math.abs(startX - i) + "" + startY);
      }
      if (
        !validPositionsHook.includes(squareAfterObj.x + "" + squareAfterObj.y)
      ) {
        return false;
      }
    } else if (pieceBefore == "bishop") {
      let validPositionsBishop = [];
      let startX = squareBeforeObj.x;
      let startY = squareBeforeObj.y;
      for (let i = 0; i < 8; i++) {
        validPositionsBishop.push(startX + i + "" + (startY + i));
        validPositionsBishop.push(startX + i + "" + Math.abs(startY - i));
        validPositionsBishop.push(
          Math.abs(startX - i) + "" + Math.abs(startY + i)
        );
        validPositionsBishop.push(
          Math.abs(startX - i) + "" + Math.abs(startY - i)
        );
      }
      if (
        !validPositionsBishop.includes(squareAfterObj.x + "" + squareAfterObj.y)
      ) {
        return false;
      }
    } else if (pieceBefore == "horse") {
      let validPositionsHorse = [];
      let startX = squareBeforeObj.x;
      let startY = squareBeforeObj.y;

      validPositionsHorse.push(startX + 1 + "" + (startY + 2));
      validPositionsHorse.push(startX + 1 + "" + (startY - 2));
      validPositionsHorse.push(startX - 1 + "" + (startY + 2));
      validPositionsHorse.push(startX - 1 + "" + (startY - 2));
      validPositionsHorse.push(startX + 2 + "" + (startY + 1));
      validPositionsHorse.push(startX + 2 + "" + (startY - 1));
      validPositionsHorse.push(startX - 2 + "" + (startY - 1));
      validPositionsHorse.push(startX - 2 + "" + (startY + 1));
      if (
        !validPositionsHorse.includes(squareAfterObj.x + "" + squareAfterObj.y)
      ) {
        return false;
      }
    } else if (pieceBefore == "queen") {
      //Otimizar isso aqui depois a queen é um hook+bishop juntos codigo repetido
      let validPositionsQueen = [];
      let startX = squareBeforeObj.x;
      let startY = squareBeforeObj.y;

      for (let i = 0; i < 8; i++) {
        validPositionsQueen.push(startX + "" + (startY + i));
        validPositionsQueen.push(startX + i + "" + startY);
        validPositionsQueen.push(startX + "" + Math.abs(startY - i));
        validPositionsQueen.push(Math.abs(startX - i) + "" + startY);
      }

      for (let i = 0; i < 8; i++) {
        validPositionsQueen.push(startX + i + "" + (startY + i));
        validPositionsQueen.push(startX + i + "" + Math.abs(startY - i));
        validPositionsQueen.push(
          Math.abs(startX - i) + "" + Math.abs(startY + i)
        );
        validPositionsQueen.push(
          Math.abs(startX - i) + "" + Math.abs(startY - i)
        );
      }

      if (
        !validPositionsQueen.includes(squareAfterObj.x + "" + squareAfterObj.y)
      ) {
        return false;
      }
    } else if (pieceBefore == "king") {
      //Otimizar isso aqui depois o rei é uma queen q só anda uma vez
      let validPositionsKing = [];
      let startX = squareBeforeObj.x;
      let startY = squareBeforeObj.y;
      for (let i = 0; i < 2; i++) {
        validPositionsKing.push(startX + "" + (startY + i));
        validPositionsKing.push(startX + i + "" + startY);
        validPositionsKing.push(startX + "" + Math.abs(startY - i));
        validPositionsKing.push(Math.abs(startX - i) + "" + startY);
      }
      for (let i = 0; i < 2; i++) {
        validPositionsKing.push(startX + i + "" + (startY + i));
        validPositionsKing.push(startX + i + "" + Math.abs(startY - i));
        validPositionsKing.push(
          Math.abs(startX - i) + "" + Math.abs(startY + i)
        );
        validPositionsKing.push(
          Math.abs(startX - i) + "" + Math.abs(startY - i)
        );
      }
      if (
        !validPositionsKing.includes(squareAfterObj.x + "" + squareAfterObj.y)
      ) {
        return false;
      }
    }
    return true;
  }

  function movePiece(squareBefore: HTMLElement, squareAfter: HTMLElement) {
    const arrayAux: SquareProps[] = [];

    squares.map((square) => {
      arrayAux.push(square);
    });

    const pieceBefore =
      squareBefore.classList.length == 3 ? squareBefore.classList[2] : "";
    const idSquareBefore = squareBefore.id;
    const idSquareAfter = squareAfter.id;
    var positionBefore = arrayAux?.findIndex(function (square) {
      return (
        square.x == Number(idSquareBefore[0]) &&
        square.y == Number(idSquareBefore[1])
      );
    });
    var positionAfter = arrayAux?.findIndex(function (square) {
      return (
        square.x == Number(idSquareAfter[0]) &&
        square.y == Number(idSquareAfter[1])
      );
    });

    if (
      canMovePiece(
        arrayAux,
        formatNumber(positionBefore),
        formatNumber(positionAfter),
        pieceBefore
      )
    ) {
      arrayAux[positionBefore].piece = undefined;
      arrayAux[positionAfter].piece = pieceBefore;
      arrayAux[positionAfter].pieceColor = arrayAux[positionBefore].pieceColor;
      arrayAux[positionBefore].pieceColor = undefined;
      setSquares(arrayAux);
      console.log("mexi");
    } else {
      console.log("nao mexi");
    }
  }

  function formatNumber(num: number) {
    return ("0" + num).slice(-2);
  }

  function handleClick(e: React.MouseEvent) {
    const element = e.target as HTMLElement;

    if (!activeSquare) {
      if (element.classList.length == 3) {
        activeSquare = element;
      }
    } else {
      if (activeSquare != element) {
        movePiece(activeSquare, element);
        activeSquare = null;
      }
    }
  }

  return (
    <div
      className="board"
      id="board"
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => handleClick(e)}
    >
      {squares?.map((square) => (
        <Square
          key={square.x + "" + square.y}
          x={square.x}
          y={square.y}
          piece={square.piece}
          pieceColor={square.pieceColor}
          backgroundColor={square.backgroundColor}
        />
      ))}
    </div>
  );
}

export default Board;
