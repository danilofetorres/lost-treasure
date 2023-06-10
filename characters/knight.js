import { createAnim } from "../utils/config.js";
import collide from "../utils/helper.js";

class Knight extends Phaser.Physics.Matter.Sprite {
  speed;
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

    this.speed = 2;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;

    this.sword_hitbox_1 = scene.add.rectangle(this.x + 15, this.y - 10, 30, 6);
    scene.physics.add.existing(this.sword_hitbox_1);

    this.sword_hitbox_2 = scene.add.circle(this.x + 15, this.y - 10, 15);
    scene.physics.add.existing(this.sword_hitbox_2);

    createAnim(scene, "idle", "knight", 14);
    createAnim(scene, "walk", "knight", 7);
    createAnim(scene, "attack", "knight", 12);
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
      if(frame.index >= 5 && frame.index <= 10) {
        this.sword_hitbox_1.x = this.flipX ? this.x - 30 : this.x + 30;
        this.sword_hitbox_1.y = this.y - 5;

        this.sword_hitbox_1.body.enable = true;
        scene.physics.world.add(this.sword_hitbox_1.body);

        if(collide(scene.warrior, this.sword_hitbox_1, 2, 1.05)) {
          if(this.can_hit_1) {
            scene.warrior.get_hit();
          }

          this.can_hit_1 = false;
        }

      } else if(frame.index > 10) {
        this.sword_hitbox_2.x = this.flipX ? this.x - 30 : this.x + 30;
        this.sword_hitbox_2.y = this.y - 5;

        this.sword_hitbox_2.body.enable = true;
        scene.physics.world.add(this.sword_hitbox_2.body);

        if(collide(scene.warrior, this.sword_hitbox_1, 2, 1.05)) {
          if(this.can_hit_2) {
            scene.warrior.get_hit();
          }

          this.can_hit_2 = false;
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
            bodyA.gameObject.tile?.layer.name === scene.barrels.layer.name ||
            bodyB.gameObject.tile?.layer.name === scene.barrels.layer.name ||
            bodyA.gameObject.tile?.layer.name === scene.traps.layer.name ||
            bodyB.gameObject.tile?.layer.name === scene.traps.layer.name
          )
        ) {
          this.setVelocityY(-7);
        }
      });
    });
  }

  climb(direction) {
    this.setVelocityY(0);

    if(direction === "up") {
      this.y -= 2;

    } else if(direction === "down") {
      this.y += 2;
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
