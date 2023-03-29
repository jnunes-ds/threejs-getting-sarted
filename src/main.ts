import * as Three from "three";
import BlasterScene from "./BlasterScene";

const { innerWidth: width, innerHeight: height } = window;

const renderer = new Three.WebGL1Renderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
});

renderer.setSize(width, height);

const mainCamera = new Three.PerspectiveCamera(60, width / height, 0.1, 100);

const scene = new BlasterScene();
scene.initialize();

renderer.render(scene, mainCamera);
