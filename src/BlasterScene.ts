import * as Three from "three";

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

class BlasterScene extends Three.Scene {
  private readonly mtlLoader = new MTLLoader();
  private readonly objLoader = new OBJLoader();

  initialize() {
    const geometry = new Three.BoxGeometry();
    const material = new Three.MeshPhongMaterial({ color: 0xffad00 });

    const cube = new Three.Mesh(geometry, material);
    cube.position.z = -5;
    cube.position.y = -1;

    this.add(cube);

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 2);

    this.add(light);
  }

  update() {
    //update
  }
}

export default BlasterScene;
