// draw in canvas
import React, { useEffect, useRef, useState } from "react";
import "./canvas.css";

function CanvasDrawing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasPosition, setCanvasPosition] = useState<DOMRect>();

  const drawHeight = 500;
  const drawWidth = 800;

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = drawWidth;
    canvas.height = drawHeight;
    canvas.style.width = `${drawWidth}px`;
    canvas.style.height = `${drawHeight}px`;

    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
      context.lineWidth = 2;
      contextRef.current = context;
    } else {
      throw new Error('Could not get canvas.getContext("2d")');
    }

    setCanvasPosition(canvas.getBoundingClientRect());
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (contextRef.current) {
      let { clientX, clientY } = e;
      clientX -= canvasPosition!.x;
      clientY -= canvasPosition!.y;
      contextRef.current.beginPath();
      contextRef.current.moveTo(clientX, clientY);
      setIsDrawing(true);
    }
  };

  const Draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    if (contextRef.current) {
      let { clientX, clientY } = e;
      clientX -= canvasPosition!.x;
      clientY -= canvasPosition!.y;

      contextRef.current.lineTo(clientX, clientY);
      contextRef.current.stroke();
    }
  };

  const endDraw = () => {
    if (contextRef.current) {
      contextRef.current?.closePath();
      setIsDrawing(false);
    }
  };

  return (
    <canvas
      id="canvas"
      onMouseDown={(e) => startDraw(e)}
      onMouseMove={(e) => Draw(e)}
      onMouseUp={endDraw}
      ref={canvasRef}
    />
  );
}

export default CanvasDrawing;
