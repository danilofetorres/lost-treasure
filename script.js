import Start from "./scenes/start.js";
import Map1 from "./scenes/map_1.js";
import Map2 from "./scenes/map_2.js";
import gameOver from "./scenes/gameOver.js";

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 480,
  scene: [Start, Map1, Map2, gameOver],
  transition: {
    target: 'slideleft',
    duration: 1000
  },
};

const game = new Phaser.Game(config);
