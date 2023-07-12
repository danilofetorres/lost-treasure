let timerInterval;

// Function to start the timer
export function startTimer(scene) {
  const bar = scene.add.graphics({ x: 1190, y: 12 });
  bar.fillStyle(0xede6e6, 1);
  bar.fillRoundedRect(0, 0, 80, 40, 10);
  bar.setScrollFactor(0);
  
  const timer = scene.add.text(1200, 20, '00:00', { fontFamily: "Arial", fontSize: "24px", color: "#000000" });
  timer.setScrollFactor(0);
  
  const start_time = Date.now(); 

  setInterval(() => {
    const elapsed_time = Math.floor((Date.now() - start_time) / 1000);
    
    const minutes = Math.floor(elapsed_time / 60);
    const seconds = elapsed_time % 60;
    
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    timer.setText(formattedTime);
  }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
}
