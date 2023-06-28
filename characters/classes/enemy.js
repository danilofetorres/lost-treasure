import Character from "./character.js";

import collide from "../../utils/helper.js";

class Enemy extends Character {
  id;
  
  constructor(id, scene, spawn, texture, frame, shape, max_health, speed) {
    super(scene, spawn, texture, frame, shape, max_health, speed);

    this.id = id;
  }

  attack(anim, scene, hitboxes) {
    const m1 = 1;
    const m2 = 1.01;
    
    const hit = (index) => {
      hitboxes[index].hitbox.x = this.flipX ? this.x - 30 : this.x + 30;
      hitboxes[index].hitbox.y = this.y - 5;
      
      hitboxes[index].hitbox.body.enable = true;
      scene.physics.world.add(hitboxes[index].hitbox.body);
      
      if(collide(scene.player, hitboxes[index].hitbox, m1, m2)) {

        if(hitboxes[index].can_hit) {
          scene.player.getHit(1);  
        }

        hitboxes[index].can_hit = false;
      }
    };
    
    this.play(anim, true);

    const startHit = (anim, frame) => { 
      hitboxes.forEach((hitbox, index) => {
        if(frame.index >= hitbox.frames[0]  && frame.index <= hitbox.frames[1]) {
          hit(index);
        }  
      });
      
      this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + anim,
      () => this.resetHitbox(scene)
    );

    this.once(
      Phaser.Animations.Events.ANIMATION_STOP,
      () => this.resetHitbox(scene)
    );
  }

  getHit(anim) {
    this.play(anim);
    this.hearts -= 1;

    this.on(`animationcomplete-${anim}`, () => {
      this.resetHitbox(this.scene);
      this.isAttackAnimationDone = true;
    });
  }

  followPlayer(player, anim) {
    this.play(anim, true);

    if(player.x < this.x) {
      this.flipX = true;
  
    } else {
      this.flipX = false;
    }

    const direction = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
    this.setVelocityX(direction.x * this.speed);
  }
}

export default Enemy;