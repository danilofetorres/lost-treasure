class Character extends Phaser.Physics.Matter.Sprite {
  max_health;
  hearts;
  speed;
  depth;
 
  constructor(scene, x, y, texture, frame, shape, max_health, speed) {
    super(scene.matter.world, x, y, texture, frame, { shape: shape });

    scene.add.existing(this);

    this.depth = 1;
    this.max_health = max_health;
    this.hearts = max_health;
    this.speed = speed;
    this.setScale(1.5);
    this.setFixedRotation();
  }

  idle(anim) {
    this.setVelocityX(0);
    this.play(anim, true);
  }

  resetHitbox(scene, hitboxes) {
    for(const hitbox of hitboxes) {
      hitbox.hitbox.body.enable = false;
      
      scene.physics.world.remove(hitbox.hitbox.body);

      hitbox.can_hit = true;
    }
  }
}

export default Character;