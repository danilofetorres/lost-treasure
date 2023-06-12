import { createAnim } from "../utils/config.js";
import collide from "../utils/helper.js";

class Knight extends Phaser.Physics.Matter.Sprite {
  health;
  health_bar;
  speed;
  depth;
  sword_hitbox_1;
  sword_hitbox_2;
  can_hit_1;
  can_hit_2;

  constructor(scene, x, y, texture, frame, physics) {
    const knight_physics = scene.cache.json.get(physics);

    super(scene.matter.world, x, y, texture, frame, {
      shape: knight_physics.knight,
    });

    scene.add.existing(this);

    this.health = 4;
    this.speed = 2.6;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;

    this.sword_hitbox_1 = scene.add.rectangle(this.x + 15, this.y - 10, 30, 6);
    scene.physics.add.existing(this.sword_hitbox_1);

    this.sword_hitbox_2 = scene.add.circle(this.x + 15, this.y - 10, 15);
    scene.physics.add.existing(this.sword_hitbox_2);

    this.health_bar = scene.add.group();

    const max_health = 4;
    const spacing = 28;
    const start_y = 60;

    for(let i=0; i<max_health; i++) {
      const heart_x = 10 + spacing * i;
      const heart_y = start_y;

      const heart = scene.add
        .sprite(heart_x, heart_y, "heart", "heart_deplete-0.png")
        .setOrigin(0, 0)
        .setScale(1.5);
      
      this.health_bar.add(heart);
    }

    createAnim(scene, "idle", "knight", 14);
    createAnim(scene, "walk", "knight", 7);
    createAnim(scene, "attack", "knight", 12, null, 0, 15, 0);
    createAnim(scene, "deplete", "heart", 4, null, 0, 10, 0);
    createAnim(scene, "deplete", "heart", 2, "first_half", 0, 10, 0,);
    createAnim(scene, "deplete", "heart", 4, "second_half", 2, 10, 0);
  }

  idle() {
    this.setVelocityX(0);
    this.play("knight_idle", true);
  }

  walk(direction) {
    if(direction === "left") {
      this.flipX = true;
      this.setVelocityX(this.speed * -1);

    } else if(direction === "right") {
      this.flipX = false;
      this.setVelocityX(this.speed);
    }

    this.play("knight_walk", true);
  }

  attack(scene) {
    this.play("knight_attack", true);

    const startHit = (anim, frame) => {
      if(scene.enemies) {

        if(frame.index >= 5 && frame.index <= 10) {
          this.sword_hitbox_1.x = this.flipX ? this.x - 30 : this.x + 30;
          this.sword_hitbox_1.y = this.y - 5;
  
          this.sword_hitbox_1.body.enable = true;
          scene.physics.world.add(this.sword_hitbox_1.body);
  
          for(let i=0; i<scene.enemies.length; i++) {

            if(collide(scene.enemies[i], this.sword_hitbox_1, 2, 1.05)) {
              if(this.can_hit_1) {
                scene.enemies[i].get_hit();

                if(scene.enemies[i].health <= 0) {
                  scene.enemies[i].die();
                  scene.enemies.splice(i, 1);
                }
              }
    
              this.can_hit_1 = false;
            }
          }

        } else if(frame.index > 10) {
          this.sword_hitbox_2.x = this.flipX ? this.x - 30 : this.x + 30;
          this.sword_hitbox_2.y = this.y - 5;
  
          this.sword_hitbox_2.body.enable = true;
          scene.physics.world.add(this.sword_hitbox_2.body);
  
          for(let i=0; i<scene.enemies.length; i++) {
            
            if(collide(scene.enemies[i], this.sword_hitbox_2, 2, 1.05)) {
              if(this.can_hit_2) {
                scene.enemies[i].get_hit();

                if(scene.enemies[i].health <= 0) {
                  scene.enemies[i].die();
                  scene.enemies.splice(i, 1);
                }
              }
    
              this.can_hit_2 = false;
            }
          }
        }
      }

      this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "knight_attack", 
      () => this.resetHitbox(scene)
    );

    this.once(
      Phaser.Animations.Events.ANIMATION_STOP, 
      () => this.resetHitbox(scene)
    );
  }

  jump(scene) {
    scene.matter.world.once("collisionactive", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if ((bodyA.label === "knight" || bodyB.label === "knight") &&
          (
            bodyA.gameObject.tile?.layer.name === scene.block_layer.layer.name ||
            bodyB.gameObject.tile?.layer.name === scene.block_layer.layer.name ||
            bodyA.gameObject.tile?.layer.name === scene.barrel_layer.layer.name ||
            bodyB.gameObject.tile?.layer.name === scene.barrel_layer.layer.name ||
            bodyA.gameObject.tile?.layer.name === scene.trap_layer.layer.name ||
            bodyB.gameObject.tile?.layer.name === scene.trap_layer.layer.name
          )
        ) {
          this.setVelocityY(-8);
        }
      });
    });
  }

  climb(direction) {
    this.setVelocityY(0);

    if(direction === "up") {
      this.y -= 1;

    } else if(direction === "down") {
      this.y += 2;
    }
  }

  get_hit(damage) {
    this.health -= damage;

    this.health_bar.children.iterate((heart, index) => {
      if(index < Math.floor(this.health)) {
        heart.setFrame("heart_deplete-0.png");

      } else if(index === Math.floor(this.health) && this.health !== Math.floor(this.health)) {
        heart.play("heart_deplete_first_half");

      } else {

        if(heart.frame.name === "heart_deplete-0.png") {
          heart.play("heart_deplete");

        } else if (heart.frame.name === "heart_deplete-2.png") {
          heart.play("heart_deplete_second_half");
        }
      }
    });
  }

  resetHitbox(scene) {
    this.sword_hitbox_1.body.enable = false;
    this.sword_hitbox_2.body.enable = false;
    scene.physics.world.remove(this.sword_hitbox_1.body);
    scene.physics.world.remove(this.sword_hitbox_2.body);
    this.can_hit_1 = true;
    this.can_hit_2 = true;
  }
}

export default Knight;
