import * as Three from "three";

const { innerWidth: width, innerHeight: height } = window;

const renderer = new Three.WebGL1Renderer({
  canvas: document.getElementById("app") as HTMLCanvasElement,
});

renderer.setSize(width, height);

const mainCamera = new Three.PerspectiveCamera(60, width / height, 0.1, 100);

const scene = new Three.Scene();

const geometry = new Three.BoxGeometry();
const material = new Three.MeshPhongMaterial({ color: 0xffad00 });

const cube = new Three.Mesh(geometry, material);
cube.position.z = -5;
cube.position.y = 1;

scene.add(cube);

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(0, 4, 2);

scene.add(light);

renderer.render(scene, mainCamera);
