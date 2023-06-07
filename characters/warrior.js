import { createAnim } from "../utils/config.js";

class Warrior extends Phaser.Physics.Matter.Sprite {
  speed;

  constructor(scene, x, y, texture, frame, physics) {
    const warriorPhysics = scene.cache.json.get(physics);

    super(scene.matter.world, x, y, texture, frame, {
      shape: warriorPhysics.warrior,
    });

    scene.add.existing(this);

    this.speed = 2;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;

    createAnim(scene, "idle", "warrior", 14);
    createAnim(scene, "walk", "warrior", 7);
    createAnim(scene, "attack", "warrior", 21);
  }

  idle() {
    this.setVelocityX(0);
    this.play("warrior_idle", true);
  }

  walk(direction) {
    
    if(direction === "left") {
      this.flipX = true;
      this.setVelocityX(this.speed * -1);

    } else if(direction === "right") {
      this.flipX = false;
      this.setVelocityX(this.speed);
    }

    this.play("warrior_walk", true);
  }
}

export default Warrior;