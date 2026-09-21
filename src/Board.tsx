import { useMemo, useState } from "react";
import { createGame, findLegalMove, legalMovesFrom, makeMove, requiresPromotionChoice } from "./chess";
import { PieceType, Position } from "./chess/types";
import PromotionPicker from "./PromotionPicker";
import Square from "./Square";

function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

function statusLabel(status: string, turn: string): string {
  const player = turn === "white" ? "White" : "Black";
  switch (status) {
    case "checkmate":
      return `Checkmate — ${turn === "white" ? "Black" : "White"} wins`;
    case "stalemate":
      return "Stalemate — draw";
    case "check":
      return `${player} to move — check`;
    default:
      return `${player} to move`;
  }
}

function Board() {
  const [game, setGame] = useState(createGame());
  const [selected, setSelected] = useState<Position | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Position; to: Position } | null>(null);

  const legalTargets = useMemo(() => (selected ? legalMovesFrom(game, selected).map((move) => move.to) : []), [game, selected]);

  function handleSquareClick(position: Position) {
    if (pendingPromotion || game.status === "checkmate" || game.status === "stalemate") return;

    const piece = game.board[position.row][position.col];

    if (selected && legalTargets.some((target) => samePosition(target, position))) {
      if (requiresPromotionChoice(game, selected, position)) {
        setPendingPromotion({ from: selected, to: position });
      } else {
        const move = findLegalMove(game, selected, position);
        if (move) setGame(makeMove(game, move));
      }
      setSelected(null);
      return;
    }

    if (piece && piece.color === game.turn) {
      setSelected(position);
    } else {
      setSelected(null);
    }
  }

  function handlePromotionPick(promotion: PieceType) {
    if (!pendingPromotion) return;
    const move = findLegalMove(game, pendingPromotion.from, pendingPromotion.to, promotion);
    if (move) setGame(makeMove(game, move));
    setPendingPromotion(null);
  }

  function handleRestart() {
    setGame(createGame());
    setSelected(null);
    setPendingPromotion(null);
  }

  return (
    <>
      <div className="board" id="board">
        {game.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            return (
              <Square
                key={`${rowIndex}${colIndex}`}
                piece={piece}
                isLight={rowIndex % 2 === colIndex % 2}
                isSelected={selected !== null && samePosition(selected, position)}
                isLegalTarget={legalTargets.some((target) => samePosition(target, position))}
                onClick={() => handleSquareClick(position)}
              />
            );
          })
        )}
      </div>
      <div className="status-bar">
        <span>{statusLabel(game.status, game.turn)}</span>
        {(game.status === "checkmate" || game.status === "stalemate") && (
          <button onClick={handleRestart}>New game</button>
        )}
      </div>
      {pendingPromotion && <PromotionPicker color={game.turn} onPick={handlePromotionPick} />}
    </>
  );
}

export default Board;
