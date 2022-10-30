import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dot, Line } from "../interfaces/interfaces";
import "./canvas.css";
import CanvasElement from "./CanvasElement";

function CanvasTest() {
  const requestRef = useRef<number | undefined>();
  const linesCollapseTimeoutRef = useRef<NodeJS.Timeout | undefined>();
  const [linesDrew, setLinesDrew] = useState<Line[]>([]);
  const [dotsDrew, setDotsDrew] = useState<Dot[]>([]);
  const [collapseStart, setCollapseStart] = useState<boolean>(false);
  const [btnClickedAtMs, setBtnClickedAtMs] = useState<number | undefined>();

  let disabled = collapseStart;
  const linesCollapseDurationMs = 1500;

  useEffect(() => {
    if (!collapseStart) {
      return;
    } else {
      requestRef.current = requestAnimationFrame(animate);
      linesCollapseTimeoutRef.current = setTimeout(
        callbackTimeout,
        linesCollapseDurationMs
      );
      return () => cancelAnimationFrame(requestRef.current!);
    }
  }, [linesDrew]);

  const callbackTimeout = () => {
    setCollapseStart(false);
    cancelAnimationFrame(requestRef.current!);
    setLinesDrew([]);
    setDotsDrew([]);
  };

  const update = useCallback(() => {
    // to decrement line on
    const L = 0.95;
    const newLines: Line[] = [];
    linesDrew.forEach((el: Line, ind) => {
      // line segment AB with C,D between: A|--C------D--|B
      const Xb = el.endX;
      const Xa = el.startX;
      const Yb = el.endY;
      const Ya = el.startY;
      const Rab = Math.sqrt(Math.abs((Xb - Xa) ^ 2) + (Math.abs(Yb - Ya) ^ 2));
      const Rac = Rab * ((1 - L) / 2);
      const Rad = Rab - Rac;
      const Kac = Rac / Rab;
      const Kad = Rad / Rab;
      const Xc = Xa + (Xb - Xa) * Kac;
      const Yc = Ya + (Yb - Ya) * Kac;
      const Xd = Xa + (Xb - Xa) * Kad;
      const Yd = Ya + (Yb - Ya) * Kad;
      newLines.push({ endX: Xd, startX: Xc, endY: Yd, startY: Yc } as Line);
    });
    setLinesDrew(newLines);
  }, [linesDrew]);

  const animate = useCallback(() => {
    // change lines array
    update();
    requestRef.current = requestAnimationFrame(animate);
  }, [linesDrew]);

  // to collapse lines
  function handleButtonClicked(e: React.MouseEvent<HTMLButtonElement>): void {
    if (collapseStart) return;
    requestRef.current = requestAnimationFrame(animate);
    setBtnClickedAtMs(Date.now());
    setCollapseStart(true);

    // to make it after 1 sec from btn click
    linesCollapseTimeoutRef.current = setTimeout(
      callbackTimeout,
      linesCollapseDurationMs
    );
  }

  return (
    <>
      <CanvasElement
        collapseStart={collapseStart}
        linesDrew={linesDrew}
        setLinesDrew={setLinesDrew}
        dotsDrew={dotsDrew}
        setDotsDrew={setDotsDrew}
      />
      <button
        id="collapseLines"
        onClick={handleButtonClicked}
        disabled={disabled}
        style={{ margin: "25px" }}
      >
        {collapseStart ? "DELETING" : "Clear canvas"}
      </button>
      <h1>
        <a
          href="https://github.com/Forseti93/canvas-test/branches"
          target={"_blank"}
        >
          GitHub
        </a>
      </h1>
      <ul>
        <li>master branch - that example</li>
        <li>other - src</li>
      </ul>
    </>
  );
}

export default CanvasTest;
