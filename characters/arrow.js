class Arrow extends Phaser.Physics.Matter.Sprite {
  scene;
  canHit;

  constructor(scene, x, y, texture, frame, physics, flipX, coords) {
    super(scene.matter.world, x, y, texture, frame, { shape: physics });
    
    this.scene = scene;
    scene.add.existing(this);

    this.setScale(1.8);
    this.setIgnoreGravity(true);
    this.setFixedRotation();
    this.setFlipX(flipX);

    const ca = coords.archerX - coords.playerX ;
    const co = coords.playerY - coords.archerY;
    const hip = Math.sqrt((ca * ca + co * co));
    const angleV = Math.acos(ca/hip);
    const angle = Phaser.Math.Angle.Between(coords.archerX, coords.archerY, coords.playerX, coords.playerY);

    this.setAngle(angle * 180/Math.PI + (flipX ? 180 : 0));
    this.setVelocityY((flipX ? (angleV * 180/Math.PI) : 180 - angleV * 180/Math.PI) / 5 * co/Math.abs(co));
    this.setVelocityX(flipX ? -10 : 10);

    this.canHit = true;
    this.body.collisionFilter.category = 0x0008;
    this.body.collisionFilter.mask = 0x0001;

    scene.matter.world.on("collisionstart", (e) => {
      e.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if((bodyA.label === "knight" || bodyB.label === "knight") && (bodyA.label === "arrow" || bodyB.label === "arrow")) {
          scene.arrows.forEach((arrow) => {

            if((bodyA.gameObject.body === arrow.body || bodyB.gameObject.body === arrow.body) && arrow.canHit) {
              arrow.canHit = false;
              arrow.setVisible(false);
              arrow.body.destroy();

              scene.player.getHit(0.5);
            }
          });

        } else if(
          (bodyA.label === "arrow" || bodyB.label === "arrow") &&
          (
            bodyA.label === "Body" ||
            bodyB.label === "Body" ||
            bodyA.label === "Rectangle Body" ||
            bodyB.label === "Rectangle Body" ||
            bodyA.label === "paredes" ||
            bodyB.label === "paredes"
          )
        ) {
          scene.arrows.forEach((arrow) => {

            if((bodyA?.gameObject?.body === arrow.body || bodyB?.gameObject?.body === arrow.body) && arrow.canHit) {
              arrow.canHit = false;
              arrow.setVisible(false);
              arrow.body.destroy();
            }
          });
        }
      });
    });
  }
}

export default Arrow;