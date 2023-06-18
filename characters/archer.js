import Enemy from "./classes/enemy.js";
import Arrow from "./arrow.js";

import { createAnim } from "../utils/config.js";

class Archer extends Enemy { 
  arrow;
  physics;
  can_hit;

  constructor(id, scene, x, y, texture, frame, physics, max_health, speed) {
    const archerPhysics = scene.cache.json.get(physics);

    super(id, scene, x, y, texture, frame, archerPhysics.archer, max_health, speed);
    //this.setBody({ type: 'rectangle', width: 25, height: 32 });

    this.setName("Archer");
    this.setFlipX(false);
    this.can_hit = true;
    this.body.collisionFilter.category = 0x0002;

    this.physics = archerPhysics.arrow;

    createAnim(scene, "idle", "archer", 16, this.id,);
    createAnim(scene, "walk", "archer", 7, this.id);
    createAnim(scene, "attack", "archer", 33, this.id, 0, 16, 0);
    createAnim(scene, "get_hit", "archer", 8, this.id, 0, 10, 0);
    createAnim(scene, "death", "archer", 14, this.id, 0, 30, 0);
  }

  attack(scene) {
    this.play(`archer_attack_${this.id}`, true);

    const startHit = (anim, frame) => {
      if (frame.index == 29) {
        if(this.can_hit){
          var arrow = new Arrow(scene, this.flipX? this.x - 40 : this.x + 40, this.y - 10, this.arrow, null, this.physics, this.flipX);
          scene.arrows.push(arrow);
        }

        //this.arrow_hitbox.body.enable = true;
        //scene.physics.world.add(this.arrow_hitbox.body);

        // if (collide(scene.knight, this.arrow_hitbox, 1, 1.01)) {
        //   if (this.can_hit) {

        //   }
           this.can_hit = false;
        // }
      }
      
      this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
      `archer_attack_${this.id}`,
      () => this.resetHitbox(scene)
    );

    this.once(Phaser.Animations.Events.ANIMATION_STOP, () =>
      this.resetHitbox(scene)
    );
  }
  resetHitbox(scene) {
    // this.arrow_hitbox.body.enable = false;

    // scene.physics.world.remove(this.arrow_hitbox.body);

     this.can_hit = true;
  }
}

export default Archer;
