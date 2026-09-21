export type Color = "white" | "black";

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}

export type Square = Piece | null;

export type Board = Square[][]; // board[row][col], row 0-1 = black start, row 6-7 = white start

export interface Position {
  row: number;
  col: number;
}

export type CastleSide = "kingside" | "queenside";

export interface Move {
  from: Position;
  to: Position;
  isEnPassantCapture?: boolean;
  castle?: CastleSide;
  promotion?: PieceType;
}

export type GameStatus = "playing" | "check" | "checkmate" | "stalemate";

export interface GameState {
  board: Board;
  turn: Color;
  enPassantTarget: Position | null;
  status: GameStatus;
  pendingPromotion: { from: Position; to: Position } | null;
}
