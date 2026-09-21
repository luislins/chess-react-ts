import { createInitialBoard, opponentOf, pieceAt } from "./board";
import { applyMove, getAllLegalMoves, getLegalMoves, isKingInCheck } from "./moves";
import { GameState, Move, Position } from "./types";

export function createGame(): GameState {
  return {
    board: createInitialBoard(),
    turn: "white",
    enPassantTarget: null,
    status: "playing",
    pendingPromotion: null,
  };
}

export function legalMovesFrom(game: GameState, from: Position): Move[] {
  const piece = pieceAt(game.board, from);
  if (!piece || piece.color !== game.turn) return [];
  return getLegalMoves(game.board, from, game.enPassantTarget);
}

/** Applies a move already known to be legal (e.g. from legalMovesFrom) and advances turn/status. */
export function makeMove(game: GameState, move: Move): GameState {
  const piece = pieceAt(game.board, move.from);
  if (!piece) return game;

  const board = applyMove(game.board, move);
  const nextTurn = opponentOf(game.turn);

  const isDoublePawnStep = piece.type === "pawn" && Math.abs(move.to.row - move.from.row) === 2;
  const enPassantTarget = isDoublePawnStep ? { row: (move.from.row + move.to.row) / 2, col: move.from.col } : null;

  const opponentMoves = getAllLegalMoves(board, nextTurn, enPassantTarget);
  const opponentInCheck = isKingInCheck(board, nextTurn);
  const status = opponentMoves.length > 0 ? (opponentInCheck ? "check" : "playing") : opponentInCheck ? "checkmate" : "stalemate";

  return { board, turn: nextTurn, enPassantTarget, status, pendingPromotion: null };
}

/** True when moving `from` to `to` is only legal as a pawn promotion, i.e. the caller must ask which piece to promote to. */
export function requiresPromotionChoice(game: GameState, from: Position, to: Position): boolean {
  return legalMovesFrom(game, from).some((move) => move.to.row === to.row && move.to.col === to.col && move.promotion !== undefined);
}

export function findLegalMove(game: GameState, from: Position, to: Position, promotion?: Move["promotion"]): Move | undefined {
  return legalMovesFrom(game, from).find(
    (move) => move.to.row === to.row && move.to.col === to.col && move.promotion === promotion
  );
}
