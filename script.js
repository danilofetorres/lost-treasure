import Map1 from "./scenes/map_1.js";
import Map2 from "./scenes/map_2.js";

const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 480,
  scene: [Map1, Map2],
};

const game = new Phaser.Game(config);
