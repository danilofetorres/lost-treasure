class FollowPlayerState {
  enemy;
  player;
  
  constructor(enemy, player) {
    this.enemy = enemy;  
    this.player = player;
  }
  
  enter() {
    this.enemy.play(`${this.enemy.texture.key}_walk_${this.enemy.id}`);
  }
   
  onUpdate() {
    if(this.player.x < this.enemy.x) {
      this.enemy.flipX = true;
  
    } else {
      this.enemy.flipX = false;
    }

    const direction = new Phaser.Math.Vector2(this.player.x - this.enemy.x, this.player.y - this.enemy.y).normalize();
    this.enemy.setVelocityX(direction.x * this.enemy.speed);
  }

  exit() {
    this.enemy.stop();
  }
}
  
export default FollowPlayerState;
  