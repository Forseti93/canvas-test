import React, { useCallback, useEffect, useRef, useState } from "react";

function TestChild(props: any) {
  return (
    <div className="child">
      TestChild
      <ul>
        {props.elementsToRender.map((el: any, id: number) => {
          return <li key={id}>{el}</li>;
        })}
      </ul>
    </div>
  );
}

export default TestChild;
