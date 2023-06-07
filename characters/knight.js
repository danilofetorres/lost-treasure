import { createAnim } from "../utils/config.js";

class Knight extends Phaser.Physics.Matter.Sprite {
  speed;

  constructor(scene, x, y, texture, frame, physics) {
    const knightPhysics = scene.cache.json.get(physics);

    super(scene.matter.world, x, y, texture, frame, {
      shape: knightPhysics.knight,
    });

    scene.add.existing(this);

    this.speed = 2;
    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;

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

  attack() {
    this.play("knight_attack", true);
  }

  jump() {
    this.setVelocityY(-7);
  }
}

export default Knight;
