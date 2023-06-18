import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class Warrior extends Enemy {
  isAttackAnimationDone;

  constructor(id, scene, x, y, texture, frame, physics, max_health, speed) {
    const warriorPhysics = scene.cache.json.get(physics);

    super(id, scene, x, y, texture, frame, warriorPhysics.warrior, max_health, speed);

    this.body.collisionFilter.category = 0x0004;

    this.hitboxes = [
      { hitbox: scene.add.circle(this.x, this.y, 27), can_hit: true, frames: [10, 15] },
      { hitbox: scene.add.rectangle(this.x + 20, this.y + this.height/5, 20, 30), can_hit: true, frames: [24, 29] },
    ]

    for(const hitbox of this.hitboxes) {
      scene.physics.add.existing(hitbox.hitbox);
    }

    this.isAttackAnimationDone = false;

    this.on(`animationrepeat`, () => {
      this.isAttackAnimationDone = true;
    });

    createAnim(scene, "idle", "warrior", 14, this.id,);
    createAnim(scene, "walk", "warrior", 7, this.id);
    createAnim(scene, "attack", "warrior", 32, this.id,7, 10, -1);
    createAnim(scene, "get_hit", "warrior", 8, this.id, 0, 10, 0);
    createAnim(scene, "death", "warrior", 35, this.id, 0, 30, 0);
  }
}

export default Warrior;
