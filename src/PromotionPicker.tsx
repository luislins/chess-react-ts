import { pieceAssetName } from "./chess";
import { Color, PieceType } from "./chess/types";

const CHOICES: PieceType[] = ["queen", "rook", "bishop", "knight"];

type PromotionPickerProps = {
  color: Color;
  onPick: (type: PieceType) => void;
};

function PromotionPicker({ color, onPick }: PromotionPickerProps) {
  return (
    <div className="promotion-overlay">
      <div className="promotion-panel">
        <p>Promote to:</p>
        <div className="promotion-choices">
          {CHOICES.map((type) => (
            <button
              key={type}
              className="promotion-choice pieceImage"
              style={{ backgroundImage: `url(/assets/pieceImages/${pieceAssetName(type)}_${color}.png)` }}
              onClick={() => onPick(type)}
              aria-label={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PromotionPicker;
