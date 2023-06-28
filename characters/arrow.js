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
    this.setVelocityX(flipX ? -10 : 10);
    this.setFlipX(flipX);
    this.canHit = true;

    this.body.collisionFilter.category = 0x0008;
    this.body.collisionFilter.mask = 0x0001;

  }

  update() {
    this.scene.matter.world.once("collisionstart", (e) => {
        //console.log(e)
      e.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if ((bodyA.label === "knight" || bodyB.label === "knight") &&
          (
            bodyA.label === "arrow" ||
            bodyB.label === "arrow"
          )
        ) {
          this.scene.arrows.forEach((arrow) => {

            if ((bodyA.gameObject.body === arrow.body || bodyB.gameObject.body === arrow.body) && arrow.canHit) {
              arrow.canHit = false;
              arrow.setVisible(false);
              arrow.body.destroy();
              this.scene.player.getHit(0.5);
            }
          });
          // console.log("yes");
        }

        else if ((bodyA.label === "arrow" || bodyB.label === "arrow") &&
          (
            bodyA.label === "Body" ||
            bodyB.label === "Body" ||
            bodyA.label === "Rectangle Body" ||
            bodyB.label === "Rectangle Body"
            
          )
        ) {
          this.scene.arrows.forEach((arrow) => {

            if ((bodyA.gameObject.body === arrow.body || bodyB.gameObject.body === arrow.body) && arrow.canHit) {
              arrow.canHit = false;
              arrow.setVisible(false);
              arrow.body.destroy();
            }
          });
        }
      });
    });

    //console.log('hit')
  }

}

export default Arrow;