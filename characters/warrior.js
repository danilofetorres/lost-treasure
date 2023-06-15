import { createAnim } from "../utils/config.js";
import collide from "../utils/helper.js";


class Warrior extends Phaser.Physics.Matter.Sprite {
  id;
  health;
  speed;
  depth;
  weapon_hitbox_1;
  weapon_hitbox_2;
  can_hit_1;
  can_hit_2;
  isAttackAnimationDone;

  constructor(scene, x, y, texture, frame, physics, id) {
    const warriorPhysics = scene.cache.json.get(physics);

    super(scene.matter.world, x, y, texture, frame, {
      shape: warriorPhysics.warrior,
    });

    scene.add.existing(this);

    this.id = id;
    this.health = 3;
    this.speed = 2;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;
    this.body.collisionFilter.category = 0x0004;


    this.weapon_hitbox_1 = scene.add.circle(this.x, this.y, 27);
    this.weapon_hitbox_2 = scene.add.rectangle(
      this.x + 20,
      this.y + this.height / 5,
      20,
      30
    );

    scene.physics.add.existing(this.weapon_hitbox_1);
    scene.physics.add.existing(this.weapon_hitbox_2);

    this.can_hit_1 = true;
    this.can_hit_2 = true;

    this.isAttackAnimationDone = false;

    this.on(`animationrepeat`, () => {
      this.isAttackAnimationDone = true;
    });

    createAnim(scene, "idle", "warrior", 14, this.id,);
    createAnim(scene, "walk", "warrior", 7, this.id);
    createAnim(scene, "attack", "warrior", 32, this.id,7, 10, 0);
    createAnim(scene, "get_hit", "warrior", 8, this.id, 0, 10, 0);
    createAnim(scene, "death", "warrior", 35, this.id, 0, 30, 0);
  }

  idle() {
    this.setVelocityX(0);
    this.play(`warrior_idle_${this.id}`, true);
  }

  walk(scene) {
    this.play(`warrior_walk_${this.id}`, true);

    if(scene.knight.x < this.x) {
      this.flipX = true;

    } else {
      this.flipX = false;
    }

    const direction = new Phaser.Math.Vector2(scene.knight.x - this.x, scene.knight.y - this.y).normalize();

    this.setVelocityX(direction.x * this.speed);
  }

  get_hit() {
    this.play(`warrior_get_hit_${this.id}`);
    this.health -= 1;
  }

  die() {
    this.play(`warrior_death_${this.id}`);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `warrior_death_${this.id}`, 
      this.destroy
    );
  }

  attack(scene){
    this.play(`warrior_attack_${this.id}`, true);

    const startHit = (anim, frame) => {
      if (frame.index >= 11 && frame.index <= 17) {
        this.weapon_hitbox_1.x = this.x;
        this.weapon_hitbox_1.y = this.y;

        this.weapon_hitbox_1.body.enable = true;
        scene.physics.world.add(this.weapon_hitbox_1.body);
        if (collide(scene.knight, this.weapon_hitbox_1, 1, 1.01)) {
          if (this.can_hit_1) {
            scene.knight.get_hit(1);
          }
          this.can_hit_1 = false;
        }
      } else if (frame.index >= 26 && frame.index <= 45) {
        this.weapon_hitbox_2.x = this.flipX ? this.x - 20 : this.x + 20;
        this.weapon_hitbox_2.y = this.y;

        this.weapon_hitbox_2.body.enable = true;
        scene.physics.world.add(this.weapon_hitbox_2.body);

        if (collide(scene.knight, this.weapon_hitbox_2, 1, 1.05)) {
          if (this.can_hit_2) {
            scene.knight.get_hit(1);
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
      `warrior_attack_${this.id}`,
      () => this.resetHitbox(scene)
    );

    this.once(Phaser.Animations.Events.ANIMATION_STOP, () =>
      this.resetHitbox(scene)
    );
  }
  resetHitbox(scene) {
    this.weapon_hitbox_1.body.enable = false;
    this.weapon_hitbox_2.body.enable = false;

    scene.physics.world.remove(this.weapon_hitbox_1.body);
    scene.physics.world.remove(this.weapon_hitbox_2.body);

    this.can_hit_1 = true;
    this.can_hit_2 = true;
  }
}

export default Warrior;
