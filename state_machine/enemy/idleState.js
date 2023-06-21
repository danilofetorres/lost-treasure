class IdleState {
  enemy;
  
  constructor(enemy) {
    this.enemy = enemy;
  }

  enter() {
    this.enemy.setVelocityX(0);
    this.enemy.play(`${this.enemy.texture.key}_idle_${this.enemy.id}`);
  }

  onUpdate() {}

  exit() {
    this.enemy.stop();
  }
}

export default IdleState;