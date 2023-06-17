import { createAnim } from "../utils/config.js";
import collide from "../utils/helper.js";

class King extends Phaser.Physics.Matter.Sprite {
  id;
  health;
  speed;
  depth;
  weapon_hitbox_1;
  weapon_hitbox_2;
  weapon_hitbox_3;
  can_hit_1;
  can_hit_2;
  can_hit_3;
  isAttackAnimationDone;

  constructor(scene, x, y, texture, frame, physics, id) {
    const kingPhysics = scene.cache.json.get(physics);

    super(scene.matter.world, x, y, texture, frame, {
      shape: kingPhysics.king,
    });

    scene.add.existing(this);

    this.id = id;
    this.hearts = 10;
    this.speed = 2;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;


    this.weapon_hitbox_1 = scene.add.circle(this.x, this.y, 42);
    this.weapon_hitbox_2 = scene.add.rectangle(this.x+20, this.y + this.height/5, 30, 50);
    this.weapon_hitbox_3 = scene.add.rectangle(this.x+20, this.y + this.height/5, 50, 10);
    

    scene.physics.add.existing(this.weapon_hitbox_1);
    scene.physics.add.existing(this.weapon_hitbox_2);
    scene.physics.add.existing(this.weapon_hitbox_3);
    this.weapon_hitbox_1.body.enable = false;
    this.weapon_hitbox_2.body.enable = false;
    this.weapon_hitbox_3.body.enable = false;

    this.can_hit_1 = true;
    this.can_hit_2 = true;
    this.can_hit_3 = true;

    this.isAttackAnimationDone = false;

    this.on(`animationrepeat`, () => {
      this.isAttackAnimationDone = true;
    });

    createAnim(scene, "idle", "king", 17, this.id);
    createAnim(scene, "walk", "king", 7, this.id);
    createAnim(scene, "attack", "king", 57, this.id);
    createAnim(scene, "ground_attack", "king", 29, this.id);
    createAnim(scene, "death", "king", 36, this.id, 0, 30, 0);
  }

  idle() {
    this.setVelocityX(0);
    this.play(`king_idle_${this.id}`, true);
  }

  walk(scene) {
    this.play(`king_walk_${this.id}`, true);

    if(scene.knight.x < this.x) {
      this.flipX = true;

    } else {
      this.flipX = false;
    }

    const direction = new Phaser.Math.Vector2(scene.knight.x - this.x, scene.knight.y - this.y).normalize();

    this.setVelocityX(direction.x * this.speed);
  }
  
  get_hit() {
    this.hearts -= 1;
  }

  attack(scene) {
    this.play(`king_attack_${this.id}`, true);

    const startHit = (anim, frame) => {
      if (frame.index >= 21 && frame.index <= 27) {
        this.weapon_hitbox_1.x = this.flipX ? this.x - 20 : this.x;
        this.weapon_hitbox_1.y = this.y;

        this.weapon_hitbox_1.body.enable = true;
        scene.physics.world.add(this.weapon_hitbox_1.body);

        if (collide(scene.knight, this.weapon_hitbox_1, 1, 1.01)) {
          if (this.can_hit_1) {
            scene.knight.getHit(1);
          }
          this.can_hit_1 = false;
        }

      } else if (frame.index >= 37 && frame.index <= 45) {
        this.weapon_hitbox_2.x = this.flipX ? this.x - 50 : this.x + 50;
        this.weapon_hitbox_2.y = this.y;

        this.weapon_hitbox_2.body.enable = true;
        scene.physics.world.add(this.weapon_hitbox_2.body);

        if (collide(scene.knight, this.weapon_hitbox_2, 1, 1.05)) {
          if (this.can_hit_2) {
            scene.knight.getHit(1);
          }
          this.can_hit_2 = false;
        }
      } else if (frame.index > 45) {
        return;
      }

      this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
        `king_attack_${this.id}`,
      () => this.reset_hitbox_atk(scene)
    );

    this.once(Phaser.Animations.Events.ANIMATION_STOP, () =>
      this.reset_hitbox_atk(scene)
    );
  }

  ground_attack(scene) {
    this.play(`king_ground_attack_${this.id}`, true);

    const startHit = (anim, frame) => {
      if (frame.index >= 19 && frame.index <= 25) {
        this.weapon_hitbox_3.x = this.x;
        this.weapon_hitbox_3.y = this.y + this.height / 8;

        this.weapon_hitbox_3.body.enable = true;

        scene.physics.world.add(this.weapon_hitbox_3.body);

        if (collide(scene.knight, this.weapon_hitbox_3, 1, 1.01)) {

          if (this.can_hit_3) {
            scene.knight.get_hit(1);
          }
          
          this.can_hit_3 = false;
        }

      } else if (frame.index > 26) {
        return;
      }

      this.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
        `king_ground_attack_${this.id}`,
      () => this.reset_hitbox_grd_atk(scene)
    );

    this.once(Phaser.Animations.Events.ANIMATION_STOP, () =>
      this.reset_hitbox_grd_atk(scene)
    );
  }

  die() {
    this.play(`king_death_${this.id}`);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `king_death_${this.id}`,
      this.destroy
    );
  }

  reset_hitbox_grd_atk(scene) {
    this.weapon_hitbox_3.body.enable = false;

    scene.physics.world.remove(this.weapon_hitbox_3.body);

    this.can_hit_3 = true;
  }

  reset_hitbox_atk(scene) {
    this.weapon_hitbox_1.body.enable = false;
    this.weapon_hitbox_2.body.enable = false;

    scene.physics.world.remove(this.weapon_hitbox_1.body);
    scene.physics.world.remove(this.weapon_hitbox_2.body);

    this.can_hit_1 = true;
    this.can_hit_2 = true;
  }
}

export default King;
