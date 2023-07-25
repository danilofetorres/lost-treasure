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
      this.exit();
    });
  }
  
  onUpdate() {}
  
  exit() {
    this.scene.camera.fadeOut(400, 0, 0, 0);
    
    this.scene.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.scene.start("game_over", { scene: this.scene.key });
    });
  }
}

export default DieState;