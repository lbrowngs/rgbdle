import React, { useState, useContext, useEffect } from "react";

import { Button } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { TheColor } from "./TheColor";
import ConfettiEl from "./ConfettiEl";
import GuessComp from "./GuessComp";
import ColorToggle from "./ColorToggle";
import HintBtn from "./HintBtn";

import { calculateContrast } from "../functions/CalculateContrast";

export default function Guess(props) {
  const answerColor = useContext(TheColor);

  const [correct, setCorrect] = useState(false);
  const [R, setR] = useState("");
  const [G, setG] = useState("");
  const [B, setB] = useState("");
  const [rgb, setRgb] = useState("");
  const [close, setClose] = useState({});

  const [current, setCurrent] = useState(false);
  const [bwDisplay, setBwDisplay] = useState("");
  const [borderColor, setBorderColor] = useState("#CDD0D5");
  const [backgroundColor, setBackgroundColor] = useState("white");

  useEffect(() => {
    props.passGuess(close);
  }, [close]); // eslint-disable-line

  useEffect(() => {
    if (props.number === props.currNo) {
      setCurrent(true);
    }
  }, [props.number, props.currNo]);

  useEffect(() => {
    setRgb(`rgba(${R},${G},${B},1)`);
  }, [R, G, B]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    var validated = await validateForm();
    if (validated) {
      setBackgroundColor(rgb);
      const contrastVal = calculateContrast([R, G, B]);
      setBwDisplay(contrastVal);
      checkGuess();
      compareGuess(false);
    }
  };

  const validateForm = async () => {
    if (!R || !G || !B) {
      setBorderColor("red");
      // findFocus(props.focus);
      return false;
    } else {
      setBorderColor("#CDD0D5");
      return true;
    }
  };

  const checkGuess = () => {
    if (rgb === answerColor) {
      setCorrect(true);
    }
    props.passCorrect(correct);
  };

  const compareGuess = (hint) => {
    const closeObj = { R: "", G: "", B: "", hints: false };
    const correctSplit = answerColor.split("(").pop();
    const correctArr = correctSplit.split(",");
    const threshold = 10;
    const answerArr = [R, G, B];
    const letters = ["R", "G", "B"];
    for (let i = 0; i < letters.length; i++) {
      let letter = letters[i];
      let answerVal = answerArr[i];
      let correctVal = correctArr[i];
      if (answerVal === correctVal) {
        closeObj[letter] = "correct";
      }
      let diff = answerVal - correctVal;
      if (Math.abs(diff) <= threshold) {
        if (diff < 0) {
          closeObj[letter] = "up";
        } else if (diff > 0) {
          closeObj[letter] = "down";
        }
      } else if (hint) {
        if (diff < 0) {
          closeObj[letter] = "hint-up";
        } else if (diff > 0) {
          closeObj[letter] = "hint-down";
        }
      }
    }
    if (hint) {
      closeObj.hints = true;
    }
    setClose(closeObj);
  };

  function setVal(letter, val) {
    if (val < 0) {
      val = 0;
    } else if (val > 255) {
      val = 255;
    }
    if (letter === "R") {
      setR(val);
    } else if (letter === "G") {
      setG(val);
    } else if (letter === "B") {
      setB(val);
    }
  }

  return (
    <form
      className="guessForm"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div
        className="guessFormInner"
        style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
      >
        <HintBtn
          number={props.number}
          passHintReq={(e) => {
            compareGuess(e);
          }}
        />
        <GuessComp
          letter={"R"}
          closeness={close[R]}
          bw={bwDisplay}
          number={props.number}
          currentGuess={props.currNo}
          passVal={(e) => {
            setVal("R", e);
          }}
          val={R}
          disable={!current}
        />
        <GuessComp
          letter={"G"}
          closeness={close[G]}
          bw={bwDisplay}
          number={props.number}
          currentGuess={props.currNo}
          passVal={(e) => {
            setVal("G", e);
          }}
          val={G}
          disable={!current}
        />
        <GuessComp
          letter={"B"}
          closeness={close[B]}
          bw={bwDisplay}
          number={props.number}
          currentGuess={props.currNo}
          passVal={(e) => {
            setVal("B", e);
          }}
          val={B}
          disable={!current}
        />
        <div className="enterBtn">
          <Button
            type="submit"
            variant="contained"
            color="grey"
            size="small"
            style={{ minWidth: "fit-content" }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </div>
        <ColorToggle contrast={bwDisplay} passContrast={setBwDisplay} />
      </div>
      <ConfettiEl show={correct} />
    </form>
  );
}
