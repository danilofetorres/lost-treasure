class MoveRightState {
  player;

  constructor(player) {
    this.player = player;
  }

  enter() { 
    this.player.play(`${this.player.texture.key}_walk`);
    this.player.flipX = false;
  }
  
  onUpdate() {
    this.player.setVelocityX(this.player.speed);
  }

  exit() {
    this.player.stop();
  }
}

export default MoveRightState;
