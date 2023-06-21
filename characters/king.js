import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class King extends Enemy {
  isAttackAnimationDone;

  constructor(id, scene, x, y, texture, frame, physics, max_health, speed) {
    const kingPhysics = scene.cache.json.get(physics);

    super(id, scene, x, y, texture, frame, kingPhysics.king, max_health, speed);

    this.hitboxes = [
      { hitbox: scene.add.circle(this.x, this.y, 42), can_hit: true, frames: [21, 25] },
      { hitbox: scene.add.rectangle(this.x + 20, this.y + this.height/5, 30, 50), can_hit: true, frames: [36, 45] },
      // { hitbox: scene.add.rectangle(this.x + 20, this.y + this.height/5, 50, 10), can_hit: true, frames: [19, 25] },
    ]

    for(const hitbox of this.hitboxes) {
      scene.physics.add.existing(hitbox.hitbox);
    }

    this.resetHitbox(scene);

    this.isAttackAnimationDone = false;

    createAnim(scene, "idle", "king", 17, this.id);
    createAnim(scene, "walk", "king", 7, this.id);
    createAnim(scene, "attack", "king", 57, this.id);
    createAnim(scene, "ground_attack", "king", 29, this.id);
    createAnim(scene, "death", "king", 36, this.id, 0, 30, 0);
  }
}

export default King;
