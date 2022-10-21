import { useEffect, useState } from "react";

type PieceProps = {
  type: string;
  position: string;
};

function Piece(props: PieceProps) {
  const [color, setColor] = useState("");

  useEffect(() => {
    if (props.position.includes("8") || props.position.includes("7")) {
      setColor("black");
    } else if (props.position.includes("1") || props.position.includes("2")) {
      setColor("white");
    }
  });

  if (color) {
    return (
      <div
        className={"piece " + color + " pieceImage"}
        style={{
          backgroundImage: `url(/assets/pieceImages/${
            props.type + "_" + color
          }.png)`,
        }}
      ></div>
    );
  } else {
    return <></>;
  }
}

export default Piece;
