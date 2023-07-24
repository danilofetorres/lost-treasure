class DieState {
  player;
  scene;
  
  constructor(scene, player) {
    this.player = player;
    this.scene = scene;
  }

  enter() {
    this.player.play(`${this.player.texture.key}_death`);

    this.player.once("animationcomplete", () => {
      this.scene.player_controller.setState("idle");
    });
  }

  onUpdate() {}

  exit() {
    this.player.setX(this.scene.player_spawn.x);
    this.player.setY(this.scene.player_spawn.y);

    this.player.flipX = false;

    this.player.hearts = this.player.max_health;
    this.player.updateHealth();

    this.scene.resetCamera();
  }
}

export default DieState;