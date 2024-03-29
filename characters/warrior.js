import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class Warrior extends Enemy {
  damage;
  isAttackAnimationDone;

  constructor(id, scene, spawn, texture, frame, physics, max_health, speed, height, width) {
    const warriorPhysics = scene.cache.json.get(physics);

    super(id, scene, spawn, texture, frame, warriorPhysics.warrior, max_health, speed, height, width);

    this.damage = 0.5;
    this.flipX = true;
    this.body.collisionFilter.category = 0x0004;
    this.isAttackAnimationDone = true;

    this.hitboxes = [
      { 
        hitbox: scene.add.circle(this.x, this.y, 15), 
        can_hit: true, 
        frames: [6, 8], 
        m1: 2, 
        m2: 1.05,
        flipX: 45,
      },
      { 
        hitbox: scene.add.rectangle(this.x + 20, this.y + this.height/5, 30, 30), 
        can_hit: true, 
        frames: [19, 22],
        m1: 2, 
        m2: 1.05,
        flipX: 45, 
      },
    ]

    for(const hitbox of this.hitboxes) {
      scene.physics.add.existing(hitbox.hitbox);
    }

    this.resetHitbox(scene);

    createAnim(scene, "idle", "warrior", 14, this.id, 0, 10, -1);
    createAnim(scene, "walk", "warrior", 7, this.id, 0, 10, -1);
    createAnim(scene, "attack", "warrior", 32, this.id,7, 10, -1, "attack");
    createAnim(scene, "death", "warrior", 35, this.id, 0, 30, 0);
  }
}

export default Warrior;
