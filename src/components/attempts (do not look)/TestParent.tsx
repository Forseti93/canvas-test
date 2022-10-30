import React, { useCallback, useEffect, useRef, useState } from "react";
import TestChild from "./TestChild";

function TestParent() {
  const [collapseStart, setCollapseStart] = useState(false);
  const [btnClickedAtMs, setBtnClickedAtMs] = useState<number | undefined>();
  const [elementsToRender, setElementsToRender] = useState<number[]>([]);
  const requestRef = useRef<number | undefined>();
  const t0Ref = useRef(Date.now());

  const msToLinesCollapse = 1000;
  
  const elementsArr = [1, 2, 3];

  useEffect(() => {
    setElementsToRender(elementsArr);
  }, []);

  let linesCollapseTimeout;

  function handleButtonClicked(e: React.MouseEvent<HTMLButtonElement>): void {
    if (collapseStart) return;
    setBtnClickedAtMs(Date.now());
    setCollapseStart(true);

    requestRef.current = requestAnimationFrame(animate);

    // to make it after 1 sec from btn click
    linesCollapseTimeout = setTimeout(() => {
      setCollapseStart(false);
      cancelAnimationFrame(requestRef.current!);
    }, msToLinesCollapse);
  }

  // #region animation
  const animate = useCallback(() => {
    console.log("animate");
    requestRef.current = requestAnimationFrame(animate);
    setElementsToRender((prev) => [...prev, prev.length + 1]);
  }, []);
  // #endregion animation

  return (
    <div className="parent">
      test for requestAnimationFrame on button click
      <TestChild elementsToRender={elementsToRender} />
      <button
        style={{ backgroundColor: collapseStart ? "grey" : "" }}
        onClick={handleButtonClicked}
      >
        to start lines collapse
      </button>
    </div>
  );
}

export default TestParent;
