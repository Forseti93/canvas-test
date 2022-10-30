export interface Dot {
  x: number;
  y: number;
}

export interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface CanvasAnimation {
  clear: Function;
  update: Function;
  render: Function;
}

export interface CanvasElementProps {
  collapseStart: boolean;
  linesDrew: Line[];
  setLinesDrew: Function;
  dotsDrew: Dot[];
  setDotsDrew: Function;
}
