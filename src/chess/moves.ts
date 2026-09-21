import { cloneBoard, findKing, isInBounds, opponentOf, pieceAt, samePosition } from "./board";
import { Board, CastleSide, Color, Move, Piece, Position } from "./types";

const ROOK_DIRECTIONS = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 },
];

const BISHOP_DIRECTIONS = [
  { row: 1, col: 1 },
  { row: 1, col: -1 },
  { row: -1, col: 1 },
  { row: -1, col: -1 },
];

const KNIGHT_OFFSETS = [
  { row: 1, col: 2 },
  { row: 1, col: -2 },
  { row: -1, col: 2 },
  { row: -1, col: -2 },
  { row: 2, col: 1 },
  { row: 2, col: -1 },
  { row: -2, col: 1 },
  { row: -2, col: -1 },
];

function pawnForwardDirection(color: Color): number {
  return color === "white" ? -1 : 1;
}

function pawnStartRow(color: Color): number {
  return color === "white" ? 6 : 1;
}

function promotionRow(color: Color): number {
  return color === "white" ? 0 : 7;
}

function add(position: Position, delta: { row: number; col: number }): Position {
  return { row: position.row + delta.row, col: position.col + delta.col };
}

function slideMoves(board: Board, from: Position, piece: Piece, directions: { row: number; col: number }[]): Position[] {
  const moves: Position[] = [];
  for (const direction of directions) {
    let next = add(from, direction);
    while (isInBounds(next)) {
      const occupant = pieceAt(board, next);
      if (!occupant) {
        moves.push(next);
      } else {
        if (occupant.color !== piece.color) moves.push(next);
        break;
      }
      next = add(next, direction);
    }
  }
  return moves;
}

function knightMoves(board: Board, from: Position, piece: Piece): Position[] {
  return KNIGHT_OFFSETS.map((offset) => add(from, offset)).filter((position) => {
    if (!isInBounds(position)) return false;
    const occupant = pieceAt(board, position);
    return !occupant || occupant.color !== piece.color;
  });
}

function kingSteps(board: Board, from: Position, piece: Piece): Position[] {
  return [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS].map((offset) => add(from, offset)).filter((position) => {
    if (!isInBounds(position)) return false;
    const occupant = pieceAt(board, position);
    return !occupant || occupant.color !== piece.color;
  });
}

/** True if `target` is attacked by a piece of `byColor`, computed by ray-casting outward from the target. */
export function isSquareAttacked(board: Board, target: Position, byColor: Color): boolean {
  const forward = pawnForwardDirection(byColor);
  for (const deltaCol of [-1, 1]) {
    const pawnPosition = { row: target.row - forward, col: target.col + deltaCol };
    if (isInBounds(pawnPosition)) {
      const occupant = pieceAt(board, pawnPosition);
      if (occupant?.type === "pawn" && occupant.color === byColor) return true;
    }
  }

  for (const offset of KNIGHT_OFFSETS) {
    const position = add(target, offset);
    if (!isInBounds(position)) continue;
    const occupant = pieceAt(board, position);
    if (occupant?.type === "knight" && occupant.color === byColor) return true;
  }

  for (const offset of [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS]) {
    const position = add(target, offset);
    if (isInBounds(position)) {
      const occupant = pieceAt(board, position);
      if (occupant?.type === "king" && occupant.color === byColor) return true;
    }
  }

  for (const direction of ROOK_DIRECTIONS) {
    let position = add(target, direction);
    while (isInBounds(position)) {
      const occupant = pieceAt(board, position);
      if (occupant) {
        if (occupant.color === byColor && (occupant.type === "rook" || occupant.type === "queen")) return true;
        break;
      }
      position = add(position, direction);
    }
  }

  for (const direction of BISHOP_DIRECTIONS) {
    let position = add(target, direction);
    while (isInBounds(position)) {
      const occupant = pieceAt(board, position);
      if (occupant) {
        if (occupant.color === byColor && (occupant.type === "bishop" || occupant.type === "queen")) return true;
        break;
      }
      position = add(position, direction);
    }
  }

  return false;
}

export function isKingInCheck(board: Board, color: Color): boolean {
  return isSquareAttacked(board, findKing(board, color), opponentOf(color));
}

function pawnMoves(board: Board, from: Position, piece: Piece, enPassantTarget: Position | null): Move[] {
  const moves: Move[] = [];
  const forward = pawnForwardDirection(piece.color);
  const oneStep = add(from, { row: forward, col: 0 });

  if (isInBounds(oneStep) && !pieceAt(board, oneStep)) {
    moves.push({ from, to: oneStep });
    const twoStep = add(from, { row: forward * 2, col: 0 });
    if (from.row === pawnStartRow(piece.color) && !pieceAt(board, twoStep)) {
      moves.push({ from, to: twoStep });
    }
  }

  for (const deltaCol of [-1, 1]) {
    const target = add(from, { row: forward, col: deltaCol });
    if (!isInBounds(target)) continue;
    const occupant = pieceAt(board, target);
    if (occupant && occupant.color !== piece.color) {
      moves.push({ from, to: target });
    } else if (!occupant && enPassantTarget && samePosition(target, enPassantTarget)) {
      moves.push({ from, to: target, isEnPassantCapture: true });
    }
  }

  return moves.flatMap((move) => {
    if (move.to.row !== promotionRow(piece.color)) return [move];
    return (["queen", "rook", "bishop", "knight"] as const).map((promotion) => ({ ...move, promotion }));
  });
}

function castleMoves(board: Board, from: Position, piece: Piece): Move[] {
  if (piece.hasMoved || isSquareAttacked(board, from, opponentOf(piece.color))) return [];

  const row = from.row;
  const moves: Move[] = [];

  const sides: { side: CastleSide; rookCol: number; step: number; passCols: number[] }[] = [
    { side: "kingside", rookCol: 7, step: 1, passCols: [5, 6] },
    { side: "queenside", rookCol: 0, step: -1, passCols: [3, 2] },
  ];

  for (const { side, rookCol, step, passCols } of sides) {
    const rook = pieceAt(board, { row, col: rookCol });
    if (!rook || rook.type !== "rook" || rook.hasMoved) continue;

    const emptyCols = side === "kingside" ? [5, 6] : [1, 2, 3];
    if (!emptyCols.every((col) => !pieceAt(board, { row, col }))) continue;
    if (passCols.some((col) => isSquareAttacked(board, { row, col }, opponentOf(piece.color)))) continue;

    moves.push({ from, to: { row, col: from.col + step * 2 }, castle: side });
  }

  return moves;
}

export function getPseudoLegalMoves(board: Board, from: Position, enPassantTarget: Position | null): Move[] {
  const piece = pieceAt(board, from);
  if (!piece) return [];

  switch (piece.type) {
    case "pawn":
      return pawnMoves(board, from, piece, enPassantTarget);
    case "knight":
      return knightMoves(board, from, piece).map((to) => ({ from, to }));
    case "bishop":
      return slideMoves(board, from, piece, BISHOP_DIRECTIONS).map((to) => ({ from, to }));
    case "rook":
      return slideMoves(board, from, piece, ROOK_DIRECTIONS).map((to) => ({ from, to }));
    case "queen":
      return slideMoves(board, from, piece, [...ROOK_DIRECTIONS, ...BISHOP_DIRECTIONS]).map((to) => ({ from, to }));
    case "king":
      return kingSteps(board, from, piece).map((to) => ({ from, to })).concat(castleMoves(board, from, piece));
  }
}

/** Applies a move to a cloned board without validating legality. Used both for real moves and check simulation. */
export function applyMove(board: Board, move: Move): Board {
  const next = cloneBoard(board);
  const piece = pieceAt(next, move.from);
  if (!piece) return next;

  next[move.from.row][move.from.col] = null;
  next[move.to.row][move.to.col] = { ...piece, type: move.promotion ?? piece.type, hasMoved: true };

  if (move.isEnPassantCapture) {
    next[move.from.row][move.to.col] = null;
  }

  if (move.castle) {
    const row = move.from.row;
    const [rookFromCol, rookToCol] = move.castle === "kingside" ? [7, move.to.col - 1] : [0, move.to.col + 1];
    const rook = pieceAt(next, { row, col: rookFromCol });
    next[row][rookFromCol] = null;
    next[row][rookToCol] = rook ? { ...rook, hasMoved: true } : null;
  }

  return next;
}

export function getLegalMoves(board: Board, from: Position, enPassantTarget: Position | null): Move[] {
  const piece = pieceAt(board, from);
  if (!piece) return [];

  return getPseudoLegalMoves(board, from, enPassantTarget).filter((move) => {
    const boardAfterMove = applyMove(board, move);
    return !isKingInCheck(boardAfterMove, piece.color);
  });
}

export function getAllLegalMoves(board: Board, color: Color, enPassantTarget: Position | null): Move[] {
  const moves: Move[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.color === color) {
        moves.push(...getLegalMoves(board, { row, col }, enPassantTarget));
      }
    }
  }
  return moves;
}
