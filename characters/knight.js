import { createAnim } from "../utils/config.js";
import collide from "../utils/helper.js";

class Knight extends Phaser.Physics.Matter.Sprite {
  health;
  health_bar;
  hearts_group;
  speed;
  depth;
  sword_hitbox_1;
  sword_hitbox_2;
  can_hit_1;
  can_hit_2;
  trap_collision;

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
    this.trap_collision = false;

    this.sword_hitbox_1 = scene.add.rectangle(this.x + 15, this.y - 10, 30, 6);
    scene.physics.add.existing(this.sword_hitbox_1);

    this.sword_hitbox_2 = scene.add.circle(this.x + 15, this.y - 10, 15);
    scene.physics.add.existing(this.sword_hitbox_2);

    this.health_bar = scene.add.graphics();
    this.health_bar.fillStyle(0x99adff, 1);
    this.health_bar.fillRoundedRect(13, 15, 132, 45, 10);

    this.health_bar.setScrollFactor(0);

    this.hearts_group = scene.add.group();
    this.body.collisionFilter.category = 0x0001;
    
    

    const spacing = 29;
    const start_y = 26;

    for (let i = 0; i < this.health; i++) {
      const heart_x = 22 + spacing * i;
      const heart_y = start_y;

      const heart = scene.add
        .sprite(heart_x, heart_y, "heart", "heart_deplete-0.png")
        .setOrigin(0, 0)
        .setScale(1.5);

      this.hearts_group.add(heart);
    }

    this.hearts_group.children.iterate(function (heart) {
      heart.setScrollFactor(0);
    });

    createAnim(scene, "idle", "knight", 14);
    createAnim(scene, "walk", "knight", 7);
    createAnim(scene, "attack", "knight", 12, null, 0, 15, 0);
    createAnim(scene, "deplete", "heart", 4, null, 0, 10, 0);
    createAnim(scene, "deplete", "heart", 2, "first_half", 0, 10, 0,);
    createAnim(scene, "deplete", "heart", 4, "second_half", 2, 10, 0);
    createAnim(scene, "death", "knight", 14, null, 0, 10, 0);
  }

  idle() {
    this.setVelocityX(0);
    this.play("knight_idle", true);
  }

  walk(direction) {
    if (direction === "left") {
      this.flipX = true;
      this.setVelocityX(this.speed * -1);

    } else if (direction === "right") {
      this.flipX = false;
      this.setVelocityX(this.speed);
    }

    this.play("knight_walk", true);
  }

  attack(scene) {
    this.play("knight_attack", true);
    let m1 = 2;
    let m2 = 1.05;
    const startHit = (anim, frame) => {
      if (scene.enemies) {

        if (frame.index >= 5 && frame.index <= 10) {
          this.sword_hitbox_1.x = this.flipX ? this.x - 30 : this.x + 30;
          this.sword_hitbox_1.y = this.y - 5;

          this.sword_hitbox_1.body.enable = true;
          scene.physics.world.add(this.sword_hitbox_1.body);

          for (let i = 0; i < scene.enemies.length; i++) {
            if (collide(scene.enemies[i], this.sword_hitbox_1, 2, 1.05)) {
              if (this.can_hit_1) {
                scene.enemies[i].get_hit();
                if (scene.enemies[i].health <= 0) {
                  scene.enemies[i].die();
                  scene.enemies.splice(i, 1);
                }
              }

              this.can_hit_1 = false;
            }
          }

        } else if (frame.index > 10) {
          this.sword_hitbox_2.x = this.flipX ? this.x - 30 : this.x + 30;
          this.sword_hitbox_2.y = this.y - 5;

          this.sword_hitbox_2.body.enable = true;
          scene.physics.world.add(this.sword_hitbox_2.body);

          for (let i = 0; i < scene.enemies.length; i++) {
            if (collide(scene.enemies[i], this.sword_hitbox_2, 2, 1.05)) {
              if (this.can_hit_2) {
                scene.enemies[i].get_hit();

                if (scene.enemies[i].health <= 0) {
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

    if (direction === "up") {
      this.y -= 1;

    } else if (direction === "down") {
      this.y += 2;
    }
  }

  get_hit(damage) {
    this.health -= damage;

    this.hearts_group.children.iterate(this.updateHearts.bind(this));

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.play("knight_death", true);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "knight_death",
      () => {
        this.setX(200).setY(200);
        this.health = 4;

        this.hearts_group.children.iterate(this.updateHearts.bind(this));
      }
    );
  }

  updateHearts(heart, index) {
    if (index < Math.floor(this.health)) {
      heart.setFrame("heart_deplete-0.png");

    } else if (index === Math.floor(this.health) && this.health !== Math.floor(this.health)) {
      heart.play("heart_deplete_first_half");

    } else {

      if (heart.frame.name === "heart_deplete-0.png") {
        heart.play("heart_deplete");

      } else if (heart.frame.name === "heart_deplete-2.png") {
        heart.play("heart_deplete_second_half");
      }
    }
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
