class Character extends Phaser.Physics.Matter.Sprite {
  max_health;
  hearts;
  speed;
  depth;
  hitboxes;
  spawn;
  width;
  height;
 
  constructor(scene, spawn, texture, frame, shape, max_health, speed, height, width) {
    super(scene.matter.world, spawn.x, spawn.y, texture, frame, { shape: shape });

    scene.add.existing(this);
    this.height = height;
    this.width = width;
    this.depth = 1;
    this.max_health = max_health;
    this.hearts = max_health;
    this.speed = speed;
    this.spawn = spawn;
    this.body.restitution = 0; 

    this.setScale(1.5);
    this.setFixedRotation();
  }

  die(anim, callback) {
    this.play(anim, true);

    this.once(
      Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + anim,
      callback
    );
  }

  resetHitbox(scene) {
    const reset = (scene, hitboxes) => {
      for(const hitbox of hitboxes) {
        hitbox.hitbox.body.enable = false;
        scene.physics.world.remove(hitbox.hitbox.body);
        hitbox.can_hit = true;
      }
    }

    if(this.hitboxes[0]?.constructor === Array) {
      for(const attack of this.hitboxes) {
        reset(scene, attack);
      }

    } else {
      reset(scene, this.hitboxes);
    }
  }
}

export default Character;