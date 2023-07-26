import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class Necromancer extends Enemy {
  damage;
  projectile;
  physics;
  projectileData;
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
    projectile,
    height,
    width
  ) {
    const necromancerPhysics = scene.cache.json.get(physics);

    super(
      id,
      scene,
      spawn,
      texture,
      frame,
      necromancerPhysics.necromancer,
      max_health,
      speed,
      height,
      width
    );

    this.damage = 1.5;
    this.body.collisionFilter.category = 0x0002;
    this.physics = necromancerPhysics.projectile;
    this.projectile = projectile;
    this.hitboxes = [];

    this.hitboxes = [
      {
        hitbox: scene.add.rectangle(this.x + 15, this.y - 10, 40, 50),
        can_hit: true,
        frames: [11, 15],
        m1: 2,
        m2: 1.05,
      },
    ];

    for (const hitbox of this.hitboxes) {
      scene.physics.add.existing(hitbox.hitbox);
    }

    this.resetHitbox(scene);

    createAnim(scene, "idle", "necromancer", 49, this.id, 0, 10, -1);
    createAnim(scene, "walk", "necromancer", 9, this.id, 0, 10, -1);
    createAnim(scene, "attack", "necromancer", 46, this.id, 0, 50, -1);
    createAnim(scene, "death", "necromancer", 51, this.id, 0, 30, 0);
    createAnim(scene, "spawn", "necromancer", 19, this.id, 0, 15, -1);

    this.can_hit = true;

    this.projectileData = {
      frame: 34,
      x: 40,
      y: 10,
    };
  }
}

export default Necromancer;
