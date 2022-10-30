import React, { useCallback, useEffect, useRef, useState } from "react";
import { CanvasElementProps, Dot, Line } from "../interfaces/interfaces";

function CanvasElement(props: CanvasElementProps) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasPosition, setCanvasPosition] = useState<DOMRect>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isMouseMove, setIsMouseMove] = useState<boolean>(false);
  const [lineStart, setLineStart] = useState<Dot>({ x: 0, y: 0 });
  const [lineEnd, setLineEnd] = useState<Dot>({ x: 0, y: 0 });

  const drawHeight = 500;
  const drawWidth = 800;

  // set styles for canvas context
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = drawWidth;
    canvas.height = drawHeight;
    canvas.style.width = `${drawWidth}px`;
    canvas.style.height = `${drawHeight}px`;

    // styles for setIsDrawing(false);
    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
      context.lineWidth = 2;
      ctxRef.current = context;
    } else {
      throw new Error('Could not get canvas.getContext("2d")');
    }
    setCanvasPosition(canvas.getBoundingClientRect());
  }, []);

  //   to re-render if lines animation started
  useEffect(() => {
    if (!props.collapseStart) return;
    clearCanvas();
    drawAllLines();
    //  make dots OK
    const newDots: Dot[] = [];

    props.linesDrew.forEach((el, ind) => {
      if (ind === 0) return;
      if (
        !intersects(
          el.startX,
          el.startY,
          el.endX,
          el.endY,
          props.linesDrew[ind - 1].startX,
          props.linesDrew[ind - 1].startY,
          props.linesDrew[ind - 1].endX,
          props.linesDrew[ind - 1].endY
        )
      )
        return;
      for (let i = 0; i <= props.linesDrew.length; i++) {
        const newDot = getDot(el, props.linesDrew[ind - 1]);
        newDots.push(newDot);
      }
    });
    props.setDotsDrew(newDots);

    drawAllDots();
  }, [props.linesDrew]);

  // draw lines array
  const drawAllLines = useCallback(() => {
    if (!ctxRef.current) return;
    if (!props.linesDrew.length) return;

    props.linesDrew.forEach((el: Line) => {
      ctxRef.current!.beginPath();
      ctxRef.current!.moveTo(el.startX, el.startY);
      ctxRef.current!.lineTo(el.endX, el.endY);
      ctxRef.current!.stroke();
    });
  }, [props.linesDrew]);

  // draw dots array
  const drawAllDots = useCallback(() => {
    if (props.dotsDrew.length) {
      props.dotsDrew.forEach((el: Dot) => {
        // add the red circle
        ctxRef.current!.fillStyle = "red";
        ctxRef.current!.beginPath();
        ctxRef.current!.arc(el.x, el.y, 6, 0, 2 * Math.PI);
        ctxRef.current!.fill();
        ctxRef.current!.stroke();
      });
    }
  }, [props.dotsDrew]);

  // clear canvas
  function clearCanvas() {
    if (!ctxRef.current) return;
    ctxRef.current.clearRect(0, 0, drawWidth, drawHeight);
  }

  // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
  function intersects(
    ABxStart: number,
    AByStart: number,
    ABxEnd: number,
    AByEnd: number,
    CDxStart: number,
    CDyStart: number,
    CDxEnd: number,
    CDyEnd: number
  ) {
    var det, gamma, lambda;
    det =
      (ABxEnd - ABxStart) * (CDyEnd - CDyStart) -
      (CDxEnd - CDxStart) * (AByEnd - AByStart);
    if (det === 0) {
      return false;
    } else {
      lambda =
        ((CDyEnd - CDyStart) * (CDxEnd - ABxStart) +
          (CDxStart - CDxEnd) * (CDyEnd - AByStart)) /
        det;
      gamma =
        ((AByStart - AByEnd) * (CDxEnd - ABxStart) +
          (ABxEnd - ABxStart) * (CDyEnd - AByStart)) /
        det;
      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
  }

  // return { x: x, y: y }
  function getDot(newLine: Line, oldLine: Line): Dot {
    // NOTE: after every new line drew - does a (newLine) have intersections with old lines (props.linesDrew[])
    // NOTE: where x1* - new line, x2* line from array
    // const d1 = (x12 * y11-x11 * y12) / (x12-x11)
    const d1 =
      (newLine.endX * newLine.startY - newLine.startX * newLine.endY) /
      (newLine.endX - newLine.startX);
    // const d2 = ( x22 * y21-x21 * y22) / (x22-x21)
    const d2 =
      (oldLine.endX * oldLine.startY - oldLine.startX * oldLine.endY) /
      (oldLine.endX - oldLine.startX);
    // const K1 = (y12-y11) / (x12-x11)
    const K1 =
      (newLine.endY - newLine.startY) / (newLine.endX - newLine.startX);
    // const K2 = (y22-y21) / (x22-x21)
    const K2 =
      (oldLine.endY - oldLine.startY) / (oldLine.endX - oldLine.startX);
    const x = (d2 - d1) / (K1 - K2);
    const y = (K1 * (d2 - d1)) / (K1 - K2) + d1;
    return { x: x, y: y };
  }

  //   to draw dots for last line
  const drawNewDot = (newLine: Line) => {
    // 2. calculate intersections for lines and draw red dot on coordinates.
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    if (!props.linesDrew[0]) return;
    for (let i = 0; i < props.linesDrew.length; i++) {
      if (
        intersects(
          newLine.startX,
          newLine.startY,
          newLine.endX,
          newLine.endY,
          props.linesDrew[i].startX,
          props.linesDrew[i].startY,
          props.linesDrew[i].endX,
          props.linesDrew[i].endY
        )
      ) {
        // getDot(newLine, props.linesDrew[i]);
        ctxRef.current!.fillStyle = "red";
        ctxRef.current!.beginPath();
        ctxRef.current!.arc(
          getDot(newLine, props.linesDrew[i]).x,
          getDot(newLine, props.linesDrew[i]).y,
          6,
          0,
          2 * Math.PI,
          false
        );
        ctxRef.current!.fill();
      }
    }
  };

  // to be used in draw() somewhere after clearRect()
  const drawDots = (newLine: Line) => {
    // during draw:
    // + 1. draw props.dotsDrew array
    drawAllDots();
    drawNewDot(newLine);
  };

  // onMouseDown - get and save where does line start
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (ctxRef.current) {
      let { clientX, clientY } = e;
      clientX -= canvasPosition!.x;
      clientY -= canvasPosition!.y;
      setLineStart({ x: clientX, y: clientY });
      ctxRef.current.strokeStyle = "navy";
      ctxRef.current.lineWidth = 3.0;
      setIsDrawing(true);
    }
  };

  // onMouseMove - clear canvas, draw line from start to mouse
  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!ctxRef.current) return;
    if (!isDrawing) return;
    setIsMouseMove(true);
    // 1.clear canvas
    clearCanvas();
    // 2.draw lines array
    drawAllLines();
    // 3.draw last line (line start , mouse location now)
    let { clientX, clientY } = e;
    clientX -= canvasPosition!.x;
    clientY -= canvasPosition!.y;
    setLineEnd({ x: clientX, y: clientY });
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(lineStart.x, lineStart.y);
    ctxRef.current.lineTo(clientX, clientY);
    ctxRef.current.stroke();
    // 4. draw dots
    drawDots({
      startX: lineStart.x,
      endX: clientX,
      startY: lineStart.y,
      endY: clientY,
    });
  };

  // onMouseUp - draw, intersects ? add in dot array : "", put in lines array
  const endDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (ctxRef.current) {
      // save last line to lines array
      const lastLine: Line = {
        startX: lineStart.x,
        startY: lineStart.y,
        endX: lineEnd.x,
        endY: lineEnd.y,
      };
      if (isMouseMove) {
        props.setLinesDrew((prev: Line[]) => [...prev, lastLine]);
        if (props.linesDrew.length) {
          for (let i = 0; i < props.linesDrew.length; i++) {
            if (
              intersects(
                lastLine.startX,
                lastLine.startY,
                lastLine.endX,
                lastLine.endY,
                props.linesDrew[i].startX,
                props.linesDrew[i].startY,
                props.linesDrew[i].endX,
                props.linesDrew[i].endY
              )
            ) {
              props.setDotsDrew((prev: Dot[]) => [
                ...prev,
                getDot(props.linesDrew[i], lastLine),
              ]);
            }
          }
        }
        setIsMouseMove(false);
      }
    }
    setIsDrawing(false);
  };

  //   const canvEl = (
  //     <canvas
  //       id="canvas"
  //       onMouseDown={startDraw}
  //       onMouseMove={draw}
  //       onMouseUp={endDraw}
  //       ref={canvasRef}
  //     />
  //   );

  return (
    <>
      {/* {canvEl} */}
      <canvas
        id="canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        ref={canvasRef}
      />
    </>
  );
}

export default CanvasElement;
