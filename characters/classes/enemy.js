import Character from "./character.js";

import collide from "../../utils/helper.js";

class Enemy extends Character {
  id;
  is_colliding_with_trap;
  health_bar;
  current_hp;
  max_health;
  healthbarwidth;
  
  constructor(id, scene, spawn, texture, frame, shape, max_health, speed, height, width) {
    super(scene, spawn, texture, frame, shape, max_health, speed, height, width);
    this.id = id;
    this.is_colliding_with_trap = false;
    this.healthbarwidth = width;
    this.max_health = max_health;
    this.health_bar = scene.add.graphics();
    this.health_bar.fillStyle(0xffffff)
    this.health_bar.fillRect(0, 0, this.healthbarwidth, 8);
    this.current_hp = scene.add.graphics();
    this.current_hp.fillStyle(0x3b0303);
    this.current_hp.fillRect(0, 0, this.healthbarwidth, 8);

  }

  attack(anim, scene, hitboxes) {
    const m1 = 1;
    const m2 = 1.01;
    
    const hit = (index) => {
      hitboxes[index].hitbox.x = this.flipX ? this.x - 30 : this.x + 35;
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
    this.healthBarChange();
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

  trapCollider(event, scene) {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      if(
        (bodyA.gameObject?.id == `${this.id}` || bodyB.gameObject?.id == `${this.id}`) &&
        (bodyA.gameObject?.tile?.layer.name === scene.trap_layer.layer.name ||
          bodyB.gameObject?.tile?.layer.name === scene.trap_layer.layer.name)
      ) {
        if(!this.is_colliding_with_trap) {
          this.setVelocityY(-6);
          this.is_colliding_with_trap = true;
        }
        setTimeout(() => {
          this.is_colliding_with_trap = false;
        }, "1000");
      }
    });
  }

  healthBarChange(){
    const percentage = this.hearts / this.max_health; 
    this.current_hp.clear();
    this.current_hp.fillStyle(0x3b0303);
    this.current_hp.fillRect(0, 0, this.healthbarwidth * percentage, 8);
    if(this.hearts === 0){
      this.current_hp.clear();
      this.health_bar.clear();
    }
  }

  updateHealthBar(){
    this.health_bar.x = this.x - this.width/6;
    this.health_bar.y = this.y + this.height/4;
    this.current_hp.x = this.x - this.width/6;
    this.current_hp.y = this.y + this.height/4;
  }
}

export default Enemy;