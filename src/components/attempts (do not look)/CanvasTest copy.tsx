import React, { useEffect, useRef, useState } from "react";
// import useAnimationFrame from "../custom hooks/useAnimationFrame";
// import { CanvasAnimation, Dot, Line } from "../interfaces/interfaces";
// import "./canvas.css";

// function CanvasTest() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
//   const [isDrawing, setIsDrawing] = useState<boolean>(false);
//   const [isMouseMove, setIsMouseMove] = useState<boolean>(false);
//   const [lineStart, setLineStart] = useState<Dot>({ x: 0, y: 0 });
//   const [lineEnd, setLineEnd] = useState<Dot>({ x: 0, y: 0 });
//   const [linesDrew, setLinesDrew] = useState<Line[]>([]);
//   const [dotsDrew, setDotsDrew] = useState<Dot[]>([]);
//   const [canvasPosition, setCanvasPosition] = useState<DOMRect>();
//   const [linesAreCollapsing, setLinesCollapse] = useState<boolean>(false);

//   const drawHeight = 500;
//   const drawWidth = 800;
//   const linesCollapseDuration = 2000;

//   // set styles for canvas context
//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     canvas.width = drawWidth;
//     canvas.height = drawHeight;
//     canvas.style.width = `${drawWidth}px`;
//     canvas.style.height = `${drawHeight}px`;

//     // styles for setIsDrawing(false);
//     const context = canvas.getContext("2d");
//     if (context) {
//       context.lineCap = "round";
//       context.lineJoin = "round";
//       context.strokeStyle = "black";
//       context.lineWidth = 2;
//       ctxRef.current = context;
//     } else {
//       throw new Error('Could not get canvas.getContext("2d")');
//     }
//     setCanvasPosition(canvas.getBoundingClientRect());
//   }, []);

//   // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
//   function intersects(
//     a: number,
//     b: number,
//     c: number,
//     d: number,
//     p: number,
//     q: number,
//     r: number,
//     s: number
//   ) {
//     var det, gamma, lambda;
//     det = (c - a) * (s - q) - (r - p) * (d - b);
//     if (det === 0) {
//       return false;
//     } else {
//       lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
//       gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
//       return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
//     }
//   }

//   // return { x: x, y: y }
//   function getDot(newLine: Line, oldLine: Line): Dot {
//     // NOTE: after every new line drew - calculate does it (newLine) has some intersections with old lines (linesDrew[])
//     // NOTE: where x1* - new line, x2* line from array
//     // const d1 = (x12 * y11-x11 * y12) / (x12-x11)
//     const d1 =
//       (newLine.endX * newLine.startY - newLine.startX * newLine.endY) /
//       (newLine.endX - newLine.startX);
//     // const d2 = ( x22 * y21-x21 * y22) / (x22-x21)
//     const d2 =
//       (oldLine.endX * oldLine.startY - oldLine.startX * oldLine.endY) /
//       (oldLine.endX - oldLine.startX);
//     // const K1 = (y12-y11) / (x12-x11)
//     const K1 =
//       (newLine.endY - newLine.startY) / (newLine.endX - newLine.startX);
//     // const K2 = (y22-y21) / (x22-x21)
//     const K2 =
//       (oldLine.endY - oldLine.startY) / (oldLine.endX - oldLine.startX);
//     const x = (d2 - d1) / (K1 - K2);
//     const y = (K1 * (d2 - d1)) / (K1 - K2) + d1;
//     return { x: x, y: y };
//   }

//   const drawNewDot = (newLine: Line) => {
//     // 2. calculate intersections for lines and draw red dot on coordinates.
//     // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
//     if (!linesDrew[0]) return;
//     for (let i = 0; i < linesDrew.length; i++) {
//       if (
//         intersects(
//           newLine.startX,
//           newLine.startY,
//           newLine.endX,
//           newLine.endY,
//           linesDrew[i].startX,
//           linesDrew[i].startY,
//           linesDrew[i].endX,
//           linesDrew[i].endY
//         )
//       ) {
//         // getDot(newLine, linesDrew[i]);
//         ctxRef.current!.fillStyle = "red";
//         ctxRef.current!.beginPath();
//         ctxRef.current!.arc(
//           getDot(newLine, linesDrew[i]).x,
//           getDot(newLine, linesDrew[i]).y,
//           6,
//           0,
//           2 * Math.PI,
//           false
//         );
//         ctxRef.current!.fill();
//       }
//     }
//   };

//   // to be used in draw() somewhere after clearRect()
//   const drawDots = (newLine: Line) => {
//     // during draw:
//     // + 1. draw dotsDrew array
//     if (dotsDrew.length) {
//       dotsDrew.forEach((el) => {
//         // add the red circle
//         ctxRef.current!.fillStyle = "red";
//         ctxRef.current!.beginPath();
//         ctxRef.current!.arc(el.x, el.y, 6, 0, 2 * Math.PI);
//         ctxRef.current!.fill();
//         ctxRef.current!.stroke();
//       });
//     }
//     drawNewDot(newLine);
//   };

//   // onMouseDown - get and save where does line start
//   const startDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
//     if (ctxRef.current) {
//       let { clientX, clientY } = e;
//       clientX -= canvasPosition!.x;
//       clientY -= canvasPosition!.y;
//       setLineStart({ x: clientX, y: clientY });
//       ctxRef.current.strokeStyle = "navy";
//       ctxRef.current.lineWidth = 3.0;
//       setIsDrawing(true);
//     }
//   };

//   // onMouseMove - clear canvas, draw line from start to mouse
//   const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
//     if (!ctxRef.current) return;
//     if (!isDrawing) return;
//     setIsMouseMove(true);
//     // 1.clear canvas
//     ctxRef.current.clearRect(0, 0, drawWidth, drawHeight);
//     // 2.draw lines array
//     if (linesDrew.length) {
//       linesDrew.forEach((el) => {
//         ctxRef.current!.beginPath();
//         ctxRef.current!.moveTo(el.startX, el.startY);
//         ctxRef.current!.lineTo(el.endX, el.endY);
//         ctxRef.current!.stroke();
//       });
//     }
//     // 3.draw line (line start , mouse location now)
//     let { clientX, clientY } = e;
//     clientX -= canvasPosition!.x;
//     clientY -= canvasPosition!.y;
//     setLineEnd({ x: clientX, y: clientY });
//     ctxRef.current.beginPath();
//     ctxRef.current.moveTo(lineStart.x, lineStart.y);
//     ctxRef.current.lineTo(clientX, clientY);
//     ctxRef.current.stroke();
//     // 4. draw dots
//     drawDots({
//       startX: lineStart.x,
//       endX: clientX,
//       startY: lineStart.y,
//       endY: clientY,
//     });
//   };
//   // onMouseUp - draw, intersects ? add in dot array : "", put in lines array
//   const endDraw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
//     if (ctxRef.current) {
//       // save last line to lines array
//       const lastLine: Line = {
//         startX: lineStart.x,
//         startY: lineStart.y,
//         endX: lineEnd.x,
//         endY: lineEnd.y,
//       };
//       if (isMouseMove) {
//         setLinesDrew((prev) => [...prev, lastLine]);
//         if (linesDrew.length) {
//           for (let i = 0; i < linesDrew.length; i++) {
//             if (
//               intersects(
//                 lastLine.startX,
//                 lastLine.startY,
//                 lastLine.endX,
//                 lastLine.endY,
//                 linesDrew[i].startX,
//                 linesDrew[i].startY,
//                 linesDrew[i].endX,
//                 linesDrew[i].endY
//               )
//             ) {
//               setDotsDrew((prev) => [...prev, getDot(linesDrew[i], lastLine)]);
//             }
//           }
//         }
//         setIsMouseMove(false);
//       }
//     }
//     setIsDrawing(false);
//   };

//   useAnimationFrame((deltaTime: number) => {
//     // Pass on a function to the setter of the state
//     // to make sure we always have the latest state
//     setCount((prevCount) => (prevCount + deltaTime * 0.01) % 100);
//   });

//   //   // step is a call back function
//   //   requestRef.current = requestAnimationFrame(step);
//   // setTimeout(() => {
//   //   if (ctxRef.current)
//   //     ctxRef.current!.clearRect(0, 0, drawWidth, drawHeight);
//   //   setLinesDrew([]);
//   //   setDotsDrew([]);
//   //   setIsDrawing(false);
//   // }, linesCollapseDuration);
//   // }

//   // timeStamp = ms from component creation
//   function tick(timeStamp: number) {
//     requestAnimationFrame(tick);

//     function clear() {
//       if (ctxRef.current) {
//         ctxRef.current.clearRect(0, 0, drawWidth, drawHeight);
//         setDotsDrew([]);
//       }
//     }

//     function update() {
//       // to decrement line on
//       const L = 0.98;
//       const newLines: Line[] = [];
//       linesDrew.forEach((el: Line, ind) => {
//         // line segment AB with C,D between: A|--C------D--|B
//         const Xb = el.endX;
//         const Xa = el.startX;
//         const Yb = el.endY;
//         const Ya = el.startY;
//         const Rab = Math.sqrt(((Xb - Xa) ^ 2) + ((Yb - Ya) ^ 2));
//         const Rac = Rab * ((1 - L) / 2);
//         const Rad = Rab - Rac;
//         const Kac = Rac / Rab;
//         const Kad = Rad / Rab;
//         const Xc = Xa + (Xb - Xa) * Kac;
//         const Yc = Ya + (Yb - Ya) * Kac;
//         const Xd = Xa + (Xb - Xa) * Kad;
//         const Yd = Ya + (Yb - Ya) * Kad;
//         newLines.push({ endX: Xd, startX: Xc, endY: Yd, startY: Yc } as Line);
//       });
//       setLinesDrew(newLines);
//     }

//     function render() {
//       if (linesDrew.length) {
//         console.log(linesDrew);
//         for (let i = 0; i < linesDrew.length; i++) {
//           ctxRef.current!.beginPath();
//           ctxRef.current!.moveTo(linesDrew[i].startX, linesDrew[i].startY);
//           ctxRef.current!.lineTo(linesDrew[i].endX, linesDrew[i].endY);
//           ctxRef.current!.stroke();
//         }
//       }
//     }

//     clear();
//     update();
//     render();
//     // /*...*/ can be used for advanced settings of the update();      clear();      render();
//     /*   
//       let pTimestamp = 0;    
//       const diff = timeStamp - pTimestamp;
//       pTimestamp = timeStamp;
//       const fps = 1000 / diff;
//       const frameRefreshInSeconds = diff / 1000; 

//       const params = {
//         timeStamp,
//         pTimestamp,
//         fps,
//         diff,
//         frameRefreshInSeconds,
//       }; 
//       */
//   }

//   function animationCollapseLines() {
//     setLinesCollapse(!linesAreCollapsing);

//     requestAnimationFrame(tick);
//   }

//   return (
//     <>
//       <canvas
//         id="canvas"
//         onMouseDown={startDraw}
//         onMouseMove={draw}
//         onMouseUp={endDraw}
//         ref={canvasRef}
//       />
//       <button id="collapseLines" onClick={animationCollapseLines}>
//         Clear canvas
//       </button>
//     </>
//   );
// }

// export default CanvasTest;
