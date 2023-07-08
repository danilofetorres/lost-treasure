import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class King extends Enemy {
  isAttackAnimationDone;

  constructor(id, scene, spawn, texture, frame, physics, max_health, speed, height, width) {
    const kingPhysics = scene.cache.json.get(physics);

    super(id, scene, spawn, texture, frame, kingPhysics.king, max_health, speed, height, width);

    this.hitboxes = [
      [
        { hitbox: scene.add.circle(this.x, this.y, 42), can_hit: true, frames: [21, 25], m1: 1, m2: 1.01 },
        { hitbox: scene.add.rectangle(this.x + 20, this.y + this.height / 5, 30, 50), can_hit: true, frames: [36, 45], m1: 1, m2: 1.01 },
      ],
      [
        { hitbox: scene.add.rectangle(this.x , this.y + 10, 80, 10), can_hit: true, frames: [19, 25], x: 0, y: 25,m1: 1, m2: 1.05},
      ]
    ]

    for(const attack of this.hitboxes) {

      for(const hitbox of attack) {
        scene.physics.add.existing(hitbox.hitbox);
      }
    }

    this.resetHitbox(scene);

    this.isAttackAnimationDone = false;

    createAnim(scene, "idle", "king", 17, this.id);
    createAnim(scene, "walk", "king", 7, this.id);
    createAnim(scene, "attack_0", "king", 57, this.id, 0, 10, -1, "attack");
    createAnim(scene, "attack_1", "king", 29, this.id, 0, 10, -1, "ground_attack");
    createAnim(scene, "death", "king", 36, this.id, 0, 30, 0);
  }
}

export default King;
