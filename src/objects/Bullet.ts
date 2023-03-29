import { Group, Vector3 } from "three";

class Bullet {
  private readonly velocity = new Vector3();

  private isDead: boolean = false;

  constructor(public readonly group: Group) {
    setTimeout(() => {
      this.isDead = true;
    }, 1000);
  }

  get shouldRemove() {
    return this.isDead;
  }

  setVelocity(x: number, y: number, z: number) {
    this.velocity.set(x, y, z);
  }

  update() {
    this.group.position.x += this.velocity.x;
    this.group.position.y += this.velocity.y;
    this.group.position.z += this.velocity.z;
  }
}

export default Bullet;
