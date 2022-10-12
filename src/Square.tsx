import Piece from "./Piece";

type SquareProps = {
  position: string;
  color: string;
};

function Square(props: SquareProps) {
  const initialPiecePosition = new Map();
  initialPiecePosition.set("a", "rook");
  initialPiecePosition.set("b", "horse");
  initialPiecePosition.set("c", "bishop");
  initialPiecePosition.set("d", "queen");
  initialPiecePosition.set("e", "king");
  initialPiecePosition.set("f", "bishop");
  initialPiecePosition.set("g", "horse");
  initialPiecePosition.set("h", "rook");

  function renderPiece(props: SquareProps) {
    if (
      props.position.includes("8") ||
      (props.position.includes("1") &&
        initialPiecePosition.get(props.position.replace(/[0-9]/g, "")))
    ) {
      return (
        <Piece
          position={props.position}
          type={initialPiecePosition.get(props.position.replace(/[0-9]/g, ""))}
        />
      );
    } else if (props.position.includes("7") || props.position.includes("2")) {
      return <Piece position={props.position} type="pawn" />;
    }
  }

  return (
    <div
      id={props.position}
      style={{ backgroundColor: props.color }}
      className="square"
    >
      {renderPiece(props)}
    </div>
  );
}

export default Square;
