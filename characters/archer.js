import Enemy from "./classes/enemy.js";

import { createAnim } from "../utils/config.js";

class Archer extends Enemy { 
  damage;
  arrow;
  physics;
  arrowData;
  can_hit;

  constructor(id, scene, spawn, texture, frame, physics, max_health, speed, arrow, height, width) {
    const archerPhysics = scene.cache.json.get(physics);

    super(id, scene, spawn, texture, frame, archerPhysics.archer, max_health, speed, height, width);

    this.damage = 0.5;
    this.body.collisionFilter.category = 0x0002;
    this.physics = archerPhysics.arrow;
    this.arrow = arrow;
    this.hitboxes = [];
    
    createAnim(scene, "idle", "archer", 16, this.id, 0, 10, -1);
    createAnim(scene, "walk", "archer", 7, this.id, 0, 10, -1);
    createAnim(scene, "attack", "archer", 33, this.id, 0, 16, -1);
    createAnim(scene, "death", "archer", 14, this.id, 0, 30, 0);

    this.can_hit = true;

    this.arrowData = {
      frame: 29,
      x: 40,
      y: 10
    }
  }
}

export default Archer;
