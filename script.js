import Map1 from "./scenes/map_1.js";
import Map2 from "./scenes/map_2.js";

const config = {
  type: Phaser.AUTO,
  width: 2400,
  height: 1000,
  scene: [Map1, Map2],
};

const game = new Phaser.Game(config);
