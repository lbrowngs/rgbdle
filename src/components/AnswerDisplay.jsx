import React, { useRef, useEffect, useContext, useState } from "react";
import StaticGuess from "./StaticGuess";

import { TheColor } from "./TheColor";

export default function AnswerDisplay(props) {
  //props: status
  const answerColor = useContext(TheColor);
  const canvasRef = useRef(null);
  const [RGB, setRGB] = useState({});

  useEffect(() => {
    const draw = (ctx) => {
      ctx.fillStyle = answerColor;
      ctx.beginPath();
      ctx.rect(0, 0, 384, 70);
      ctx.fill();
    };

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    draw(context);

    const breakApartVals = () => {
      const stringSplit = answerColor.split(",");
      const R = parseInt(stringSplit[0].split("(").pop());
      const G = parseInt(stringSplit[1]);
      const B = parseInt(stringSplit[2]);
      setRGB({ R: R, G: G, B: B });
    };

    breakApartVals();
  }, [answerColor]);

  if (props.status === "progress") {
    return (
      <div style={{ margin: "auto", width: "384px" }}>
        <canvas ref={canvasRef} {...props} width="384" height="70" />
      </div>
    );
  } else {
    return (
      <div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <StaticGuess colors={RGB} />
      </div>
    );
  }
}
