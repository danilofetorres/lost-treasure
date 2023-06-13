import { createAnim } from "../utils/config.js";
import collide from "../utils/helper.js";


class Archer extends Phaser.Physics.Matter.Sprite {
  id;
  health;
  speed;
  depth;
  arrow_hitbox;
  can_hit;

  constructor(scene, x, y, texture, frame, physics, id) {
    const archerPhysics = scene.cache.json.get(physics);

    super(scene.matter.world, x, y, texture, frame, {
      shape: archerPhysics.archer,
    });

    scene.add.existing(this);

    this.id = id;
    this.health = 3;
    this.speed = 2;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;

    this.arrow_hitbox = scene.add.rectangle(this.x, this.y, 27, 30, '0xffffff', 1);
    scene.physics.add.existing(this.arrow_hitbox);

    this.can_hit = true;

    createAnim(scene, "idle", "archer", 16, this.id,);
    createAnim(scene, "walk", "archer", 7, this.id);
    createAnim(scene, "attack", "archer", 33, this.id, 0, 16, 0);
    createAnim(scene, "get_hit", "archer", 8, this.id, 0, 10, 0);
    createAnim(scene, "death", "archer", 14, this.id, 0, 30, 0);
  }

  idle() {
    this.setVelocityX(0);
    this.play(`archer_idle_${this.id}`, true);
  }

  walk(direction) {
    if(direction === "left") {
      this.flipX = true;
      this.setVelocityX(this.speed * -1);

    } else if(direction === "right") {
      this.flipX = false;
      this.setVelocityX(this.speed);
    }

    this.play(`archer_walk_${this.id}`, true);
  }

  get_hit() {
    this.play(`archer_get_hit_${this.id}`);
    this.health -= 1;
  }

  die() {
    this.play(`archer_death_${this.id}`);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `archer_death_${this.id}`, 
      this.destroy
    );
  }

  attack(scene){
    this.play(`archer_attack_${this.id}`);

    const startHit = (anim, frame) => {
      if(frame.index >= 11 && frame.index <= 17) {
        this.arrow_hitbox.x = this.x;
        this.arrow_hitbox.y = this.y;

        this.arrow_hitbox.body.enable = true;
        scene.physics.world.add(this.arrow_hitbox.body);

        if(collide(scene.knight, this.arrow_hitbox, 1, 1.01)) {
          if (this.can_hit) {
            console.log('2897y');
          }
          this.can_hit= false;
        }
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
    this.arrow_hitbox.body.enable = false;

    scene.physics.world.remove(this.arrow_hitbox.body);

    this.can_hit= true;
  }
}

export default Archer;
