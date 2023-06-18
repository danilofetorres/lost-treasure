import Character from "./character.js";

import collide from "../../utils/helper.js";

class Player extends Character {
  health_bar;
  heart_group;
  is_colliding_with_trap;
  
  constructor(scene, x, y, texture, frame, shape, max_health, speed) {
    super(scene, x, y, texture, frame, shape, max_health, speed);

    this.is_colliding_with_trap = false;

    this.health_bar = scene.add.graphics();
    this.health_bar.fillStyle(0x99adff, 1);
    this.health_bar.fillRoundedRect(13, 15, 190, 45, 10);
    this.health_bar.setScrollFactor(0);

    this.heart_group = scene.add.group();

    const spacing = 29;
    const start_y = 26;
    
    for(let i=0; i<this.hearts; i++) {
      const heart_x = 22 + spacing * i;
      const heart_y = start_y;

      const heart = scene.add
        .sprite(heart_x, heart_y, "heart", "heart_deplete-0.png")
        .setOrigin(0, 0)
        .setScale(1.5);

      this.heart_group.add(heart);
    }
    
    this.heart_group.children.iterate((heart) => {
      heart.setScrollFactor(0);
    });
  }

  walk(anim, direction) {
    if(direction === "left") {
      this.flipX = true;
      this.setVelocityX(this.speed * -1);

    } else if(direction === "right") {
      this.flipX = false;
      this.setVelocityX(this.speed);
    }

    this.play(anim, true);
  }

  climb(direction) {
    this.setVelocityY(0);

    if(direction === "up") {
      this.y -= 1;

    } else if(direction === "down") {
      this.y += 2;
    }
  }

  jump(scene) {
    scene.matter.world.once("collisionactive", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if((bodyA.label === "knight" || bodyB.label === "knight") &&
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

  attack(anim, scene, hitboxes) {
    const m1 = 2;
    const m2 = 1.05;
    
    const hit = (index) => {
      hitboxes[index].hitbox.x = this.flipX ? this.x - 30 : this.x + 30;
      hitboxes[index].hitbox.y = this.y - 5;
      
      hitboxes[index].hitbox.body.enable = true;
      scene.physics.world.add(hitboxes[index].hitbox.body);
      
      for(let i=0; i<scene.enemies.length; i++) {
        const enemy = scene.enemies[i];
        
        if(collide(enemy, hitboxes[index].hitbox, m1, m2)) {

          if(hitboxes[index].can_hit) {
            enemy.getHit(`${enemy.texture.key}_get_hit_${enemy.id}`);
            
            if(enemy.hearts <= 0) {
              enemy.die(`${enemy.texture.key}_death_${enemy.id}`, () => {
                enemy.destroy();
              });
              scene.enemies.splice(i, 1);
            }
          }

          hitboxes[index].can_hit = false;
        }
      }
    };
    
    this.play(anim, true);

    const startHit = (anim, frame) => {
      if(scene.enemies) {

        hitboxes.forEach((hitbox, index) => {
          if(frame.index >= hitbox.frames[0]  && frame.index <= hitbox.frames[1]) {
            hit(index);
          }  
        });
      }

      this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + anim,
      () => this.resetHitbox(scene, hitboxes)
    );

    this.once(
      Phaser.Animations.Events.ANIMATION_STOP,
      () => this.resetHitbox(scene, hitboxes)
    );
  }

  getHit(damage) {
    this.hearts -= damage;

    this.updateHearts();

    if(this.hearts <= 0) {
      this.die("knight_death", () => {
        this.setX(200).setY(200);
        this.hearts = this.max_health;

        this.updateHearts();
      });
    }
  }

  updateHearts() {
    this.heart_group.children.iterate((heart, index) => {

      if(index < Math.floor(this.hearts)) {
        heart.setFrame("heart_deplete-0.png");

      } else if(index === Math.floor(this.hearts) && this.hearts !== Math.floor(this.hearts)) {
        heart.play("heart_deplete_first_half");

      } else {

        if(heart.frame.name === "heart_deplete-0.png") {
          heart.play("heart_deplete");

        } else if(heart.frame.name === "heart_deplete-2.png") {
          heart.play("heart_deplete_second_half");
        }
      }
    });
  }
}

export default Player;