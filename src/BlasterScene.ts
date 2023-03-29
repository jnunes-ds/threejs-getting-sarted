import * as Three from "three";

import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

class BlasterScene extends Three.Scene {
  private readonly mtlLoader = new MTLLoader();
  private readonly objLoader = new OBJLoader();

  async initialize() {
    const targetMtl = await this.mtlLoader.loadAsync("assets/targetA.mtl");
    targetMtl.preload();

    const target1 = await this.createTarget(targetMtl);
    target1.position.x = -1;
    target1.position.z = -3;

    const target2 = await this.createTarget(targetMtl);
    target2.position.x = 1;
    target2.position.z = -3;

    const target3 = await this.createTarget(targetMtl);
    target3.position.x = 2;
    target3.position.z = -3;

    const target4 = await this.createTarget(targetMtl);
    target4.position.x = -2;
    target4.position.z = -3;

    this.add(target1, target2, target3, target4);

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 2);

    this.add(light);
  }

  private async createTarget(mtl: MTLLoader.MaterialCreator) {
    this.objLoader.setMaterials(mtl);

    const modelRoot = await this.objLoader.loadAsync("assets/targetA.obj");

    modelRoot.rotateY(Math.PI * 0.5);

    return modelRoot;
  }

  update() {
    //update
  }
}

export default BlasterScene;
