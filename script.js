import Map1 from "./scenes/map_1.js";
import Map2 from "./scenes/map_2.js";

const config = {
  type: Phaser.AUTO,
  width: 3000,
  height: 3000,
  backgroundColor: "#f9f9f9",
  physics: {
    // default: "arcade",
    // arcade: {
    //   gravity: {
    //     y: 0,
    //   },
    //   debug: true,
    // },
    default: "matter",
    matter: {
      gravity: { y: 1 },
      enableSleep: false,
      debug: true,
    },
  },
  scene: [Map1, Map2],
};

const game = new Phaser.Game(config);
