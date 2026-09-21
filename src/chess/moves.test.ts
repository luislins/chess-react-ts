import { describe, expect, it } from "vitest";
import { createInitialBoard } from "./board";
import { applyMove, getAllLegalMoves, getLegalMoves, isKingInCheck } from "./moves";
import { Board, Piece, Position } from "./types";

function emptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array<Piece | null>(8).fill(null));
}

function place(board: Board, position: Position, piece: Piece): void {
  board[position.row][position.col] = piece;
}

describe("initial position", () => {
  it("gives white 20 legal moves as the opening move", () => {
    const board = createInitialBoard();
    expect(getAllLegalMoves(board, "white", null)).toHaveLength(20);
  });
});

describe("check detection", () => {
  it("flags the king in check when a rook has a clear line to it", () => {
    const board = emptyBoard();
    place(board, { row: 0, col: 4 }, { type: "king", color: "black", hasMoved: false });
    place(board, { row: 7, col: 4 }, { type: "king", color: "white", hasMoved: false });
    place(board, { row: 5, col: 4 }, { type: "rook", color: "black", hasMoved: false });

    expect(isKingInCheck(board, "white")).toBe(true);
  });

  it("does not allow a move that leaves the mover's own king in check (absolute pin)", () => {
    const board = emptyBoard();
    place(board, { row: 7, col: 4 }, { type: "king", color: "white", hasMoved: false });
    place(board, { row: 6, col: 4 }, { type: "bishop", color: "white", hasMoved: false });
    place(board, { row: 0, col: 4 }, { type: "king", color: "black", hasMoved: false });
    place(board, { row: 5, col: 4 }, { type: "rook", color: "black", hasMoved: false });

    const moves = getLegalMoves(board, { row: 6, col: 4 }, null);
    expect(moves).toHaveLength(0);
  });
});

describe("checkmate", () => {
  it("detects fool's mate", () => {
    const board = createInitialBoard();
    let state: { board: Board; turn: "white" | "black"; enPassantTarget: Position | null } = {
      board,
      turn: "white",
      enPassantTarget: null,
    };

    const play = (from: Position, to: Position) => {
      const move = getLegalMoves(state.board, from, state.enPassantTarget).find(
        (m) => m.to.row === to.row && m.to.col === to.col
      );
      if (!move) throw new Error("expected move to be legal");
      state = {
        board: applyMove(state.board, move),
        turn: state.turn === "white" ? "black" : "white",
        enPassantTarget: null,
      };
    };

    play({ row: 6, col: 5 }, { row: 5, col: 5 }); // 1. f3
    play({ row: 1, col: 4 }, { row: 3, col: 4 }); // 1... e5
    play({ row: 6, col: 6 }, { row: 4, col: 6 }); // 2. g4
    play({ row: 0, col: 3 }, { row: 4, col: 7 }); // 2... Qh4#

    expect(isKingInCheck(state.board, "white")).toBe(true);
    expect(getAllLegalMoves(state.board, "white", null)).toHaveLength(0);
  });
});

describe("castling", () => {
  it("allows kingside castling when the path is clear and safe", () => {
    const board = emptyBoard();
    place(board, { row: 7, col: 4 }, { type: "king", color: "white", hasMoved: false });
    place(board, { row: 7, col: 7 }, { type: "rook", color: "white", hasMoved: false });
    place(board, { row: 0, col: 4 }, { type: "king", color: "black", hasMoved: false });

    const moves = getLegalMoves(board, { row: 7, col: 4 }, null);
    expect(moves.some((m) => m.castle === "kingside")).toBe(true);
  });

  it("forbids castling through an attacked square", () => {
    const board = emptyBoard();
    place(board, { row: 7, col: 4 }, { type: "king", color: "white", hasMoved: false });
    place(board, { row: 7, col: 7 }, { type: "rook", color: "white", hasMoved: false });
    place(board, { row: 0, col: 4 }, { type: "king", color: "black", hasMoved: false });
    place(board, { row: 0, col: 5 }, { type: "rook", color: "black", hasMoved: false }); // attacks f1, the king's pass-through square

    const moves = getLegalMoves(board, { row: 7, col: 4 }, null);
    expect(moves.some((m) => m.castle === "kingside")).toBe(false);
  });
});

describe("en passant", () => {
  it("allows capturing a pawn that just double-stepped alongside", () => {
    const board = emptyBoard();
    place(board, { row: 7, col: 4 }, { type: "king", color: "white", hasMoved: false });
    place(board, { row: 0, col: 4 }, { type: "king", color: "black", hasMoved: false });
    place(board, { row: 3, col: 3 }, { type: "pawn", color: "white", hasMoved: true });
    place(board, { row: 3, col: 4 }, { type: "pawn", color: "black", hasMoved: true });

    const enPassantTarget: Position = { row: 2, col: 4 };
    const moves = getLegalMoves(board, { row: 3, col: 3 }, enPassantTarget);
    expect(moves.some((m) => m.isEnPassantCapture && m.to.row === 2 && m.to.col === 4)).toBe(true);
  });
});

describe("promotion", () => {
  it("offers all four promotion choices when a pawn reaches the last rank", () => {
    const board = emptyBoard();
    place(board, { row: 7, col: 4 }, { type: "king", color: "white", hasMoved: false });
    place(board, { row: 0, col: 4 }, { type: "king", color: "black", hasMoved: false });
    place(board, { row: 1, col: 0 }, { type: "pawn", color: "white", hasMoved: true });

    const moves = getLegalMoves(board, { row: 1, col: 0 }, null);
    const promotions = moves.filter((m) => m.to.row === 0 && m.to.col === 0).map((m) => m.promotion);
    expect(promotions.sort()).toEqual(["bishop", "knight", "queen", "rook"]);
  });
});
