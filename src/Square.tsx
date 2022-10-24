import { useEffect, useState } from "react";
import { COLORS } from "./colors";

type SquareProps = {
  x: number;
  y: number;
  backgroundColor: string;
  piece: string | undefined;
  pieceColor: string | undefined;
};

function Square(props: SquareProps) {
  const [piece, setPiece] = useState<string | undefined>();
  const [pieceColor, setPieceColor] = useState<string | undefined>();
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>("");
  const [indicator, showIndicator] = useState<boolean>(false);

  useEffect(() => {
    setPiece(props.piece);
    setPieceColor(props.pieceColor);
    setBackgroundColor(props.backgroundColor);
  }, [props.piece, props.pieceColor]);

  function highlightPieceRightClick() {
    const redColorBg = backgroundColor == COLORS.light_square_green ? "#d46c51" : "#ec7e6a";
    setBackgroundColor(backgroundColor != redColorBg ? redColorBg : props.backgroundColor);
  }
  function highlightPieceLeftClick() {
    setBackgroundColor(backgroundColor != COLORS.yellow_squared_active ? COLORS.yellow_squared_active : props.backgroundColor);
    //provavelmtne com context
  }

  const hintColor = backgroundColor == COLORS.light_square_green ? "#d6d6bd" : "#6a874d";

  return (
    <div
      onContextMenu={() => highlightPieceRightClick()}
      // onClick={() => highlightPieceLeftClick()}
      id={props.x + "" + props.y}
      style={{
        backgroundImage: piece && pieceColor ? `url(/assets/pieceImages/${piece + "_" + pieceColor}.png)` : "",
        backgroundColor: backgroundColor,
      }}
      className={`square pieceImage ${piece ? piece : ""}`}
    >
      {indicator && (
        <div
          style={{
            backgroundColor: hintColor,
          }}
          className="indicator"
        ></div>
      )}
    </div>
  );
}

export default Square;
