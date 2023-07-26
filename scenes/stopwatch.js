class Stopwatch extends Phaser.Scene {
  stopwatch;
  timerInterval;
  
  constructor() {
    super({ key: "stopwatch" });
  }

  create() {
    const bar = this.add.graphics({ x: 1190, y: 12 });
    bar.fillStyle(0xede6e6, 1);
    bar.fillRoundedRect(0, 0, 80, 40, 10);
    bar.setScrollFactor(0);
  
    this.timer = this.add.text(1200, 20, '00:00', { fontFamily: "Arial", fontSize: "24px", color: "#000000" });
    this.timer.setScrollFactor(0);
    
    const start_time = Date.now(); 

    this.timerInterval = setInterval(() => {
      const elapsed_time = Math.floor((Date.now() - start_time) / 1000);
      
      const minutes = Math.floor(elapsed_time / 60);
      const seconds = elapsed_time % 60;
      
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      this.timer.setText(formattedTime);
    }, 1000);

    this.events.on('sleep', () => {
      clearInterval(this.timerInterval);
    });

    this.events.on('wake', () => {
      this.timer.setText('00:00');

      const start_time2 = Date.now(); 

      this.timerInterval = setInterval(() => {
        const elapsed_time = Math.floor((Date.now() - start_time2) / 1000);
        
        const minutes = Math.floor(elapsed_time / 60);
        const seconds = elapsed_time % 60;
        
        const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
        this.timer.setText(formattedTime);
      }, 1000);
    });

    this.events.on('shutdown', () => {
      clearInterval(this.timerInterval);

      const user = prompt("Please enter your name:");

      if(user != null) {
        axios.post("https://jumbled-river-bush.glitch.me", {
          player: user,
          time: this.timer._text
        })
      }
    });
  }
}

export default Stopwatch;