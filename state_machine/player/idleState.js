class IdleState {
  player;
  
  constructor(player) {
    this.player = player;
  }

  enter() {
    this.player.setVelocityX(0);
    this.player.play(`${this.player.texture.key}_idle`);
  }

  onUpdate() {}

  exit() {
    this.player.stop();
  }
}

export default IdleState;