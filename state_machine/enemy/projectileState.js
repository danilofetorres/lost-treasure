import Projectile from "../../characters/Projectile.js";

class ProjectileState {
  enemy;
  scene;
  player;

  constructor(enemy, scene, player) {
    this.enemy = enemy;
    this.scene = scene;
    this.player = player;
  }

  enter() {
    this.enemy.play(`${this.enemy.texture.key}_attack_${this.enemy.id}`);
  }

  onUpdate() {
    this.enemy.updateFlipX();
    const startHit = (anim, frame) => {
      if(frame.index == this.enemy.projectileData.frame) {

        if(this.enemy.can_hit) {
          const projectile = new Projectile(this.scene, this.enemy.flipX ? this.enemy.x - this.enemy.projectileData.x : this.enemy.x + this.enemy.projectileData.x, this.enemy.y - this.enemy.projectileData.y, this.enemy.projectile, null, this.enemy.physics, this.enemy.flipX, {enemyX: this.enemy.x, enemyY: this.enemy.y, playerX: this.player.x, playerY: this.player.y}, this.enemy);
          this.scene.projectiles.push(projectile);
        }

        this.enemy.can_hit = false;
      }
            
      this.enemy.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.enemy.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.enemy.on("animationrepeat", () => {

      if(this.enemy.controller.current_state === this.enemy.controller.states["projectileAttack"]) {
        this.enemy.isAttackAnimationDone = true;
        this.enemy.can_hit = true;  
        this.exit();
      }
    });
  }

  exit() {
    this.enemy.stop();
  }
}

export default ProjectileState;