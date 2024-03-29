class gameOver extends Phaser.Scene {
  constructor() {
    super({ key: "game_over" });
  }

  preload() {
    this.load.image("background", "assets/background.jpg");
  }

  create(data) {
    this.scale.resize(1280, 480);
    
    this.cameras.main.fadeIn(1000, 0, 0, 0); 

    // In-game text
    this.add.image(0, 0, "background").setOrigin(0.2, 0.15).setAlpha(0.3, 0.3, 0.3, 0.3);
    this.add.text(640, 200, "Game Over", { fontFamily: "MedievalSharp", fontSize: "40px" }).setOrigin(0.5);
    
    const button_bg = this.add.graphics();
    
    // In-game button
    button_bg.fillStyle(0xdc3545, 1);
    button_bg.fillRoundedRect(580, 270, 120, 40, 10);
    
    const restartButton = this.add.text(640, 290, "Try Again", { fontFamily: "Arial", fontSize: "18px" }).setOrigin(0.5);
    
    restartButton.setInteractive();
    
    // Add an event listener to start the game when the button is clicked
    restartButton.on('pointerdown', () => {      
      this.cameras.main.fadeOut(400, 0, 0, 0);

      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        this.scene.start("map1");
      });
    });
  }
}

export default gameOver;
