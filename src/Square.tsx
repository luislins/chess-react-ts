import { pieceAssetName } from "./chess";
import { Piece } from "./chess/types";
import { COLORS } from "./colors";

type SquareProps = {
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  onClick: () => void;
};

function Square({ piece, isLight, isSelected, isLegalTarget, onClick }: SquareProps) {
  const baseColor = isLight ? COLORS.light_square_green : COLORS.dark_square_green;
  const backgroundColor = isSelected ? COLORS.yellow_squared_active : baseColor;
  const hintColor = isLight ? COLORS.hint_color_light : COLORS.hint_color_dark;

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        backgroundImage: piece ? `url(/assets/pieceImages/${pieceAssetName(piece.type)}_${piece.color}.png)` : undefined,
        backgroundColor,
      }}
      className="square pieceImage"
    >
      {isLegalTarget && <div style={{ backgroundColor: hintColor }} className="indicator" />}
    </div>
  );
}

export default Square;
