import Piece from "./Piece";

type SquareProps = {
  position: string;
  color: string;
};

function Square(props: SquareProps) {
  return (
    <div style={{ backgroundColor: props.color }} className="square">
      {props.position.includes("8") ||
      props.position.includes("7") ||
      props.position.includes("2") ||
      props.position.includes("1") ? (
        <Piece />
      ) : (
        ""
      )}
    </div>
  );
}

export default Square;
