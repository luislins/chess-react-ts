import { Board, Color, PieceType, Position, Square } from "./types";

const BACK_RANK: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array<Square>(8).fill(null));

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: BACK_RANK[col], color: "black", hasMoved: false };
    board[1][col] = { type: "pawn", color: "black", hasMoved: false };
    board[6][col] = { type: "pawn", color: "white", hasMoved: false };
    board[7][col] = { type: BACK_RANK[col], color: "white", hasMoved: false };
  }

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((square) => (square ? { ...square } : null)));
}

export function isInBounds(position: Position): boolean {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
}

export function pieceAt(board: Board, position: Position): Square {
  return board[position.row][position.col];
}

export function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function opponentOf(color: Color): Color {
  return color === "white" ? "black" : "white";
}

export function findKing(board: Board, color: Color): Position {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (square?.type === "king" && square.color === color) {
        return { row, col };
      }
    }
  }
  throw new Error(`No ${color} king on the board`);
}

// Piece image assets keep their original names (from when the engine called knights "horse").
export function pieceAssetName(type: PieceType): string {
  return type === "knight" ? "horse" : type;
}
