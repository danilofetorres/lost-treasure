import Player from "./classes/player.js";

import { createAnim } from "../utils/config.js";

class Knight extends Player {
  constructor(scene, x, y, texture, frame, physics, max_health, speed) {
    const knight_physics = scene.cache.json.get(physics);

    super(scene, x, y, texture, frame, knight_physics.knight, max_health, speed);
    
    this.body.collisionFilter.category = 0x0001;

    this.hitboxes = [
      { hitbox: scene.add.rectangle(this.x + 15, this.y - 10, 30, 6), can_hit: true, frames: [5, 10] },
      { hitbox: scene.add.circle(this.x + 15, this.y - 10, 15), can_hit: true, frames: [11, 21] },
    ]

    for(const hitbox of this.hitboxes) {
      scene.physics.add.existing(hitbox.hitbox);
    }

    this.resetHitbox(scene);
    
    createAnim(scene, "idle", "knight", 14);
    createAnim(scene, "walk", "knight", 7);
    createAnim(scene, "attack", "knight", 12, null, 0, 15);
    createAnim(scene, "deplete", "heart", 4, null, 0, 10, 0);
    createAnim(scene, "deplete", "heart", 2, "first_half", 0, 10, 0);
    createAnim(scene, "deplete", "heart", 4, "second_half", 2, 10, 0);
    createAnim(scene, "death", "knight", 14, null, 0, 10, 0);
  }
}

export default Knight;
