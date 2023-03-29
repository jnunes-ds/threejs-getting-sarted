import * as Three from "three";

const { innerWidth: width, innerHeight: height } = window;

const render = new Three.WebGL1Renderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
});

render.setSize(width, height);
