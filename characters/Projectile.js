class Projectile extends Phaser.Physics.Matter.Sprite {
  scene;
  canHit;
  enemy;

  constructor(scene, x, y, texture, frame, physics, flipX, coords, enemy) {
    super(scene.matter.world, x, y, texture, frame, { shape: physics });
    
    this.scene = scene;
    scene.add.existing(this);

    this.setScale(1.8);
    this.setIgnoreGravity(true);
    this.setFixedRotation();
    this.setFlipX(flipX);
    this.enemy = enemy;
    this.body.frictionAir = 0;
    const ca = coords.enemyX - coords.playerX ;
    const co = coords.playerY - coords.enemyY;
    const hip = Math.sqrt((ca * ca + co * co));
    const angleV = Math.acos(ca/hip);
    const angle = Phaser.Math.Angle.Between(coords.enemyX, coords.enemyY, coords.playerX, coords.playerY);

    this.setAngle(angle * 180/Math.PI + (flipX ? 180 : 0));
    const velocityX = flipX ? -10 : 10;
    const velocityY = (flipX ? (angleV * 180/Math.PI) : 180 - angleV * 180/Math.PI) / 5 * co/Math.abs(co)
    this.setVelocity(velocityX, velocityY);
    //this.setVelocityY();

    this.canHit = true;
    this.body.collisionFilter.category = 0x0008;
    this.body.collisionFilter.mask = 0x0001;

    scene.matter.world.on("collisionstart", (e) => {
      e.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if((bodyA.label === "knight" || bodyB.label === "knight") && ((bodyA.label === "arrow" || bodyB.label === "arrow") || (bodyA.label === "projectile" || bodyB.label === "projectile"))) {
          scene.projectiles.forEach((projectile) => {

            if((bodyA.gameObject.body === projectile.body || bodyB.gameObject.body === projectile.body) && projectile.canHit) {
              projectile.canHit = false;
              projectile.setVisible(false);
              projectile.body.destroy();

              scene.player.getHit(this.enemy.damage);
            }
          });

        } else if(
          ((bodyA.label === "arrow" || bodyB.label === "arrow") || (bodyA.label === "projectile" || bodyB.label === "projectile")) &&
          (
            bodyA.label === "Body" ||
            bodyB.label === "Body" ||
            bodyA.label === "Rectangle Body" ||
            bodyB.label === "Rectangle Body" ||
            bodyA.label === "paredes" ||
            bodyB.label === "paredes"
          )
        ) {
          scene.projectiles.forEach((projectile) => {

            if((bodyA?.gameObject?.body === projectile.body || bodyB?.gameObject?.body === projectile.body) && projectile.canHit) {
              projectile.canHit = false;
              projectile.setVisible(false);
              projectile.body.destroy();
            }
          });
        }
      });
    });
  }
}

export default Projectile;