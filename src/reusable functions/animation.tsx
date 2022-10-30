import { CanvasAnimation } from "../interfaces/interfaces";

export default function animation(obj: CanvasAnimation) {
  const { clear, update, render } = obj;

  requestAnimationFrame(tick);

  function tick(timeStamp: number) {
    requestAnimationFrame(tick);

    clear(timeStamp);
    update(timeStamp);
    render(timeStamp);
  }
}
