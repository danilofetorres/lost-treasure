class Start extends Phaser.Scene {
  constructor() {
    super({ key: "start" });
  }

  preload() {
    this.load.image("background", "assets/background.jpg");
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0.2, 0.15).setAlpha(0.3, 0.3, 0.3, 0.3);
    this.add.text(640, 200, "The Quest For The Lost Treasure", { fontFamily: "MedievalSharp", fontSize: '40px' }).setOrigin(0.5);
    
    const button_bg = this.add.graphics();
    
    // Draw the button shape with rounded corners
    button_bg.fillStyle(0xdc3545, 1);
    button_bg.fillRoundedRect(580, 270, 120, 40, 10);
    
    const startButton = this.add.text(640, 290, 'Start Game', { fontFamily: 'Arial', fontSize: '18px' }).setOrigin(0.5);
    
    startButton.setInteractive();
    
    // Add an event listener to start the game when the button is clicked
    startButton.on('pointerdown', () => {
      const title_h1 = document.getElementById("title");   
      const canvas = document.querySelector("canvas");   
      const buttons = document.querySelector(".buttons");

      title_h1.style.display = "block";
      canvas.style.marginTop = "0";
      buttons.style.display = "inline-block";

      this.cameras.main.fadeOut(400, 0, 0, 0);

      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        this.scene.start("map1");
      });
    });
  }
}

export default Start;
