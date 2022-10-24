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
          backgroundColor: i % 2 == j % 2 ? COLORS.light_square_green : COLORS.dark_square_green,
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

  function validPositionsHook(startX: number, startY: number) {
    let validPositionsHook = [];
    for (let i = 0; i < 8; i++) {
      validPositionsHook.push(startX + "" + (startY + i));
      validPositionsHook.push(startX + i + "" + startY);
      validPositionsHook.push(startX + "" + Math.abs(startY - i));
      validPositionsHook.push(Math.abs(startX - i) + "" + startY);
    }
    return validPositionsHook;
  }

  function validPositionsBishop(startX: number, startY: number) {
    let validPositionsBishop = [];
    for (let i = 0; i < 8; i++) {
      validPositionsBishop.push(startX + i + "" + (startY + i));
      validPositionsBishop.push(startX + i + "" + Math.abs(startY - i));
      validPositionsBishop.push(Math.abs(startX - i) + "" + Math.abs(startY + i));
      validPositionsBishop.push(Math.abs(startX - i) + "" + Math.abs(startY - i));
    }
    return validPositionsBishop;
  }

  function validPositionsHorse(startX: number, startY: number) {
    let validPositionsHorse = [];
    validPositionsHorse.push(startX + 1 + "" + (startY + 2));
    validPositionsHorse.push(startX + 1 + "" + (startY - 2));
    validPositionsHorse.push(startX - 1 + "" + (startY + 2));
    validPositionsHorse.push(startX - 1 + "" + (startY - 2));
    validPositionsHorse.push(startX + 2 + "" + (startY + 1));
    validPositionsHorse.push(startX + 2 + "" + (startY - 1));
    validPositionsHorse.push(startX - 2 + "" + (startY - 1));
    validPositionsHorse.push(startX - 2 + "" + (startY + 1));
    return validPositionsHorse;
  }

  function isValidMove(startX: number, startY: number, endX: number, endY: number, pieceBefore: string) {
    let validPositions: string[] = [];
    if (pieceBefore == "pawn") {
      if (Math.abs(startX - endX) > 1 || Math.abs(startY - endY) > 1) {
        return false;
      }
      validPositions = validPositionsHook(startX, startY);
    } else if (pieceBefore == "rook") {
      validPositions = validPositionsHook(startX, startY);
    } else if (pieceBefore == "bishop") {
      validPositions = validPositionsBishop(startX, startY);
    } else if (pieceBefore == "horse") {
      validPositions = validPositionsHorse(startX, startY);
    } else if (pieceBefore == "queen") {
      validPositions = validPositionsHook(startX, startY).concat(validPositionsBishop(startX, startY));
    } else if (pieceBefore == "king") {
      if (Math.abs(startX - endX) > 1 || Math.abs(startY - endY) > 1) {
        return false;
      }
      validPositions = validPositionsHook(startX, startY).concat(validPositionsBishop(startX, startY));
    }

    if (!validPositions.includes(endX + "" + endY)) {
      return false;
    }
    return true;
  }

  function canMovePiece(arrayAux: SquareProps[], positionBefore: string, positionAfter: string, pieceBefore: string) {
    const squareBeforeObj = arrayAux[Number(positionBefore)];
    const squareAfterObj = arrayAux[Number(positionAfter)];
    const color = squareBeforeObj.pieceColor;

    //Checks only if piece are moving acoordingly to the type
    if (!isValidMove(squareBeforeObj.x, squareBeforeObj.y, squareAfterObj.x, squareAfterObj.y, pieceBefore)) {
      return false;
    }

    //Specifics rules

    //Dont take piece of same color
    if (squareBeforeObj.pieceColor && squareAfterObj.pieceColor && squareBeforeObj.pieceColor == squareAfterObj.pieceColor) {
      return false;
    }

    if (pieceBefore == "pawn") {
      //Pawn can only go one direction depending color
      if (color == "black") {
        if (squareAfterObj.x < squareBeforeObj.x) {
          return false;
        }
      } else if (color == "white") {
        if (squareAfterObj.x > squareBeforeObj.x) {
          return false;
        }
      }
    }
    return true;
  }

  function movePiece(squareBefore: HTMLElement, squareAfter: HTMLElement) {
    const arrayAux: SquareProps[] = [];

    squares.map((square) => {
      arrayAux.push(square);
    });

    const pieceBefore = squareBefore.classList.length == 3 ? squareBefore.classList[2] : "";
    const idSquareBefore = squareBefore.id;
    const idSquareAfter = squareAfter.id;
    var positionBefore = arrayAux?.findIndex(function (square) {
      return square.x == Number(idSquareBefore[0]) && square.y == Number(idSquareBefore[1]);
    });
    var positionAfter = arrayAux?.findIndex(function (square) {
      return square.x == Number(idSquareAfter[0]) && square.y == Number(idSquareAfter[1]);
    });

    if (canMovePiece(arrayAux, formatNumber(positionBefore), formatNumber(positionAfter), pieceBefore)) {
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
    <div className="board" id="board" onContextMenu={(e) => e.preventDefault()} onClick={(e) => handleClick(e)}>
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
