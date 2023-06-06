class Knight extends Phaser.Physics.Matter.Sprite {

  constructor(scene, x, y, texture, frame, shape) {
    const knightPhysics = scene.cache.json.get(shape);

    super(scene.matter.world, x, y, texture, frame, {
      shape: knightPhysics.knight,
    });

    scene.add.existing(this);

    this.setScale(1.5);
    this.setFixedRotation();
    this.depth = 1;
  }
}

export default Knight;
