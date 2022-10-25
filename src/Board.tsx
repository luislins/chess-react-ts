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
  const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>();
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
    setIsWhiteTurn(true);
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

  function validPositionsHook(startX: number, startY: number, endX: number, endY: number) {
    let validPositionsHook = [];
    let parada = 8;
    let onlyVertical = false;
    // Fiz essa alteração pra pegar a contagem certa de quadrados , ele tava sendo pegando por força bruta todos possiveis
    // TODO : fazer isso nas outras peças
    if (endX == startX) {
      onlyVertical = false;
      parada = Math.abs(startY - endY) + 1;
    } else if (endY == startY) {
      onlyVertical = true;
      parada = Math.abs(startX - endX) + 1;
    }
    for (let i = 1; i < parada; i++) {
      if (onlyVertical) {
        validPositionsHook.push(startX + i + "" + startY);
        validPositionsHook.push(Math.abs(startX - i) + "" + startY);
      } else {
        validPositionsHook.push(startX + "" + Math.abs(startY - i));
        validPositionsHook.push(startX + "" + (startY + i));
      }
    }
    return [...new Set(validPositionsHook)];
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

  function validPositionsKing(startX: number, startY: number, endX: number, endY: number) {
    return validPositionsHook(startX, startY, endX, endY).concat(validPositionsBishop(startX, startY));
  }

  function checkIfPieceMovementOverlaps(
    validPositions: string[],
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    piece: string | undefined
  ) {
    if (piece && piece == "horse") {
      return false;
    }
    let retorno = false;
    let foiPraCima = false;
    let foiPraDireita = false;
    // só pra hook , bishop complica
    if (endX < startX) {
      foiPraCima = true;
    } else if (endX == startX) {
      if (endY > startY) {
        foiPraDireita = true;
      }
    }

    validPositions.map((position) => {
      if (position != startX + "" + startY) {
        let squareObject = squares?.find(function (square) {
          return square.x == Number(position[0]) && square.y == Number(position[1]);
        });

        if (foiPraCima && Number(position[0]) < Number(startX)) {
          if (position != endX + "" + endY && squareObject?.piece != undefined) {
            console.log("overlap");
            retorno = true;
          }
        } else if (!foiPraCima && Number(position[0]) > Number(startX)) {
          if (position != endX + "" + endY && squareObject?.piece != undefined) {
            console.log("overlap");
            retorno = true;
          }
        } else if (foiPraDireita && Number(position[1]) > Number(startY)) {
          if (position != endX + "" + endY && squareObject?.piece != undefined) {
            console.log("overlap");
            retorno = true;
          }
        } else if (!foiPraDireita && Number(position[1]) < Number(startY)) {
          if (position != endX + "" + endY && squareObject?.piece != undefined) {
            console.log("overlap");
            retorno = true;
          }
        }
      }
    });

    return retorno;
  }

  function canMovePiece(arrayAux: SquareProps[], positionBefore: string, positionAfter: string) {
    const squareBeforeObj = arrayAux[Number(positionBefore)];
    const squareAfterObj = arrayAux[Number(positionAfter)];
    if (!squareBeforeObj || !squareAfterObj) {
      return false;
    }

    const startX = squareBeforeObj.x;
    const startY = squareBeforeObj.y;
    const endX = squareAfterObj.x;
    const endY = squareAfterObj.y;

    //General rules
    // if (squareBeforeObj.pieceColor == "white" && !isWhiteTurn) {
    //   return false;
    // } else if (squareBeforeObj.pieceColor == "black" && isWhiteTurn) {
    //   return false;
    // }

    //Dont take piece of same color
    if (squareBeforeObj.pieceColor && squareAfterObj.pieceColor && squareBeforeObj.pieceColor == squareAfterObj.pieceColor) {
      return false;
    }

    //Specific Rules per type
    let validPositions: string[] = [];
    if (squareBeforeObj.piece == "pawn") {
      const X = Number(startX + "" + startY);
      const moveQuantity =
        (squareBeforeObj.pieceColor == "white" && X >= 60 && X <= 67) || (squareBeforeObj.pieceColor == "black" && X >= 10 && X <= 17) ? 2 : 1;

      // Can move only one time WIP or two time if first move
      if (Math.abs(startX - endX) > moveQuantity || Math.abs(startY - endY) > moveQuantity) {
        return false;
      }
      // Move in only one direction depending color
      if (squareBeforeObj.pieceColor == "black") {
        if (endX < startX) {
          return false;
        } //Check if piece ahead doesnt contains piece
        else if (squareAfterObj.piece != undefined && endX == startX + 1 && endY == startY) {
          return false;
        }
      } else if (squareBeforeObj.pieceColor == "white") {
        if (endX > startX) {
          return false;
        } //Check if piece ahead doesnt contains piece
        else if (squareAfterObj.piece != undefined && endX == startX - 1 && endY == startY) {
          return false;
        }
      }
      validPositions = validPositionsHook(startX, startY, endX, endY);

      if (squareAfterObj.piece !== undefined) {
        if ((squareBeforeObj.pieceColor == "white" && startX - 1 == endX && startY + 1 == endY) || (startX - 1 == endX && startY - 1 == endY)) {
          validPositions.push(endX + "" + endY);
        } else if (
          (squareBeforeObj.pieceColor == "black" && startX + 1 == endX && startY - 1 == endY) ||
          (startX + 1 == endX && startY + 1 == endY)
        ) {
          validPositions.push(endX + "" + endY);
        }
      } else if (endY != startY) {
        //Cant move horizontallyQ
        return false;
      }
      //Checar en passant
    } else if (squareBeforeObj.piece == "rook") {
      validPositions = validPositionsHook(startX, startY, endX, endY);
      console.log(validPositions);
    } else if (squareBeforeObj.piece == "bishop") {
      validPositions = validPositionsBishop(startX, startY);
    } else if (squareBeforeObj.piece == "horse") {
      validPositions = validPositionsHorse(startX, startY);
    } else if (squareBeforeObj.piece == "queen") {
      validPositions = validPositionsHook(startX, startY, endX, endY).concat(validPositionsBishop(startX, startY));
    } else if (squareBeforeObj.piece == "king") {
      if (Math.abs(startX - endX) > 1 || Math.abs(startY - endY) > 1) {
        return false;
      }
      validPositions = validPositionsKing(startX, startY, endX, endY);
    }

    if (!validPositions.includes(endX + "" + endY)) {
      return false;
    }
    if (squareBeforeObj.piece != "pawn" && checkIfPieceMovementOverlaps(validPositions, startX, startY, endX, endY, squareBeforeObj.piece)) {
      return false;
    }
    setIsWhiteTurn(!isWhiteTurn);
    return true;
  }

  function movePiece(squareBefore: HTMLElement, squareAfter: HTMLElement) {
    const arrayAux: SquareProps[] = [...squares];

    const pieceBefore = squareBefore.classList.length == 3 ? squareBefore.classList[2] : "";
    const idSquareBefore = squareBefore.id;
    const idSquareAfter = squareAfter.id;
    let positionBefore = arrayAux?.findIndex(function (square) {
      return square.x == Number(idSquareBefore[0]) && square.y == Number(idSquareBefore[1]);
    });
    let positionAfter = arrayAux?.findIndex(function (square) {
      return square.x == Number(idSquareAfter[0]) && square.y == Number(idSquareAfter[1]);
    });

    if (canMovePiece(arrayAux, formatNumber(positionBefore), formatNumber(positionAfter))) {
      arrayAux[positionBefore].piece = undefined;
      arrayAux[positionAfter].piece = pieceBefore;
      arrayAux[positionAfter].pieceColor = arrayAux[positionBefore].pieceColor;
      arrayAux[positionBefore].pieceColor = undefined;
      setSquares(arrayAux);
    } else {
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
    <>
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
      <div>Turno: {isWhiteTurn ? "branco" : "preto"}</div>
    </>
  );
}

export default Board;
