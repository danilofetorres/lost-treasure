import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class Archer2 extends Enemy {
  damage;
  arrow;
  physics;
  arrowData;
  can_hit;

  constructor(
    id,
    scene,
    spawn,
    texture,
    frame,
    physics,
    max_health,
    speed,
    arrow,
    height,
    width
  ) {
    const archerPhysics = scene.cache.json.get(physics);

    super(
      id,
      scene,
      spawn,
      texture,
      frame,
      archerPhysics.archer2,
      max_health,
      speed,
      height,
      width
    );

    this.damage = 1;
    this.body.collisionFilter.category = 0x0002;
    this.physics = archerPhysics.arrow;
    this.arrow = arrow;
    this.hitboxes = [];

    this.hitboxes = [
      {
        hitbox: scene.add.rectangle(this.x + 15, this.y - 10, 30, 6),
        can_hit: true,
        frames: [5, 10],
        m1: 2,
        m2: 1.05,
      },
      {
        hitbox: scene.add.circle(this.x + 15, this.y - 10, 15),
        can_hit: true,
        frames: [14, 22],
        m1: 2,
        m2: 1.05,
      },
    ];

    for (const hitbox of this.hitboxes) {
      scene.physics.add.existing(hitbox.hitbox);
    }

    this.resetHitbox(scene);

    createAnim(scene, "idle", "archer2", 7, this.id, 0, 10, -1);
    createAnim(scene, "walk", "archer2", 7, this.id, 0, 10, -1);
    createAnim(scene, "attack", "archer2", 13, this.id, 0, 25, -1);
    createAnim(scene, "death", "archer2", 23, this.id, 0, 30, 0);
    createAnim(scene, "melee", "archer2", 27, this.id, 0, 20, -1);

    this.can_hit = true;

    this.arrowData = {
      frame: 9,
      x: 40,
      y: 10,
    };
  }
}

export default Archer2;
