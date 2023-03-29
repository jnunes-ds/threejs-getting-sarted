import * as Three from "three";

import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import Bullet from "../objects/Bullet";

class BlasterScene extends Three.Scene {
  private readonly mtlLoader = new MTLLoader();
  private readonly objLoader = new OBJLoader();

  private readonly keyDown = new Set<string>();

  private blaster?: Three.Group;
  private bulletMtl?: MTLLoader.MaterialCreator;

  private directionVector = new Three.Vector3();

  private bullets: Bullet[] = [];

  constructor(private readonly camera: Three.PerspectiveCamera) {
    super();
  }

  async initialize() {
    const targetMtl = await this.mtlLoader.loadAsync("assets/targetA.mtl");
    targetMtl.preload();

    this.bulletMtl = await this.mtlLoader.loadAsync("assets/foamBulletB.mtl");
    this.bulletMtl.preload();

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

    this.blaster = await this.createBlaster();
    this.add(this.blaster);
    this.blaster.position.z = 3;
    this.blaster.add(this.camera);

    this.camera.position.z = 1;
    this.camera.position.y = 0.5;

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(0, 4, 2);

    this.add(light);

    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    this.keyDown.add(event.key.toLowerCase());
  };
  private handleKeyUp = (event: KeyboardEvent) => {
    this.keyDown.delete(event.key.toLowerCase());

    if (event.key === " ") {
      this.createBullet();
    }
  };

  private updateInput() {
    if (!this.blaster) return;

    const shiftkey = this.keyDown.has("shift");

    if (!shiftkey) {
      if (this.keyDown.has("a") || this.keyDown.has("arrowleft")) {
        this.blaster.rotateY(0.02);
      } else if (this.keyDown.has("d") || this.keyDown.has("arrowright")) {
        this.blaster.rotateY(-0.02);
      }
    }
    const dir = this.directionVector;
    this.camera.getWorldDirection(dir);

    const speed = 0.1;

    if (this.keyDown.has("w") || this.keyDown.has("arrowup")) {
      this.blaster.position.add(dir.clone().multiplyScalar(speed));
    } else if (this.keyDown.has("s") || this.keyDown.has("arrowdown")) {
      this.blaster.position.add(dir.clone().multiplyScalar(-speed));
    }

    if (shiftkey) {
      const strafeDir = dir.clone();
      const upVector = new Three.Vector3(0, 1, 0);

      if (this.keyDown.has("a") || this.keyDown.has("arrowleft")) {
        this.blaster.position
          .add(strafeDir.applyAxisAngle(upVector, Math.PI * 0.5))
          .multiplyScalar(speed);
      } else if (this.keyDown.has("d") || this.keyDown.has("arrowright")) {
        this.blaster.position
          .add(strafeDir.applyAxisAngle(upVector, Math.PI * -0.5))
          .multiplyScalar(speed);
      }
    }
  }

  private async createTarget(mtl: MTLLoader.MaterialCreator) {
    this.objLoader.setMaterials(mtl);

    const modelRoot = await this.objLoader.loadAsync("assets/targetA.obj");

    modelRoot.rotateY(Math.PI * 0.5);

    return modelRoot;
  }

  private async createBlaster() {
    const mtl = await this.mtlLoader.loadAsync("assets/blasterG.mtl");
    mtl.preload();

    this.objLoader.setMaterials(mtl);

    const modelRoot = await this.objLoader.loadAsync("assets/blasterG.obj");

    return modelRoot;
  }

  private async createBullet() {
    if (!this.blaster) return;

    if (this.bulletMtl) {
      this.objLoader.setMaterials(this.bulletMtl);
    }

    const bulletModel = await this.objLoader.loadAsync(
      "assets/foamBulletB.obj"
    );

    this.camera.getWorldDirection(this.directionVector);

    const aabb = new Three.Box3().setFromObject(this.blaster);
    const size = aabb.getSize(new Three.Vector3());

    const vec = this.blaster.position.clone();
    vec.y += 0.06;

    bulletModel.position.add(
      vec.add(this.directionVector.clone().multiplyScalar(size.z * 0.5))
    );

    //rotate children to match gun
    bulletModel.children.forEach((child) => child.rotateX(Math.PI * -0.5));

    // usee the same rotation as the gun
    bulletModel.rotation.copy(this.blaster.rotation);

    this.add(bulletModel);

    const b = new Bullet(bulletModel);
    b.setVelocity(
      this.directionVector.x * 0.2,
      this.directionVector.y * 0.2,
      this.directionVector.z * 0.2
    );

    this.bullets.push(b);
  }

  private updateBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      b.update();

      if (b.shouldRemove) {
        this.remove(b.group);
        this.bullets.splice(i, 1);
        i--;
      }
    }
  }

  update() {
    //update
    this.updateInput();
    this.updateBullets();
  }
}

export default BlasterScene;
