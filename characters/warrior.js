import { createAnim } from "../utils/config.js";

class Warrior extends Phaser.Physics.Matter.Sprite {
  id;
  health;
  speed;
  depth;

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

    createAnim(scene, id, "idle", "warrior", 14);
    createAnim(scene, id, "walk", "warrior", 7);
    createAnim(scene, id, "attack", "warrior", 21);
    createAnim(scene, id, "get_hit", "warrior", 8);
    createAnim(scene, id, "death", "warrior", 35, 30);
  }

  idle() {
    this.setVelocityX(0);
    this.play(`warrior_idle_${this.id}`, true);
  }

  walk(direction) {
    if(direction === "left") {
      this.flipX = true;
      this.setVelocityX(this.speed * -1);

    } else if(direction === "right") {
      this.flipX = false;
      this.setVelocityX(this.speed);
    }

    this.play(`warrior_walk_${this.id}`, true);
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
}

export default Warrior;
