import Map from "./classes/map.js";
import Knight from "../characters/knight.js";
import PlayerController from "../state_machine/player/controller/playerController.js";

import { createWall, createLayer } from "../utils/config.js";

class TreasureRoom extends Map {
  player;
  player_spawn;
  player_controller;
  enemies;
  projectiles;
  in_treasure_room;

  constructor() {
    super("treasure_room", "map2");
  }

  init() {
    super.init();
  
    this.enemies = [];
    this.projectiles = [];

    this.in_treasure_room = false;
  }

  preload() {
    this.camera.fadeIn(1000, 0, 0, 0);

    super.preload();

    this.load.atlas("knight", "assets/character/knight/atlas/knight.png", "assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "assets/character/knight/physics/knight.json");
  }

  create(data) {
    this.scale.resize(1280, 528);

    this.camera.fadeIn(1000, 0, 0, 0); 
    
    super.create();
    
    createLayer(this, "objetos");
    createLayer(this, "moedas");
    createLayer(this, "baus");
    const wallCollisionLeft = this.matter.add.rectangle(40, 0, 10, 6000, { isStatic: true, label: "paredes" });
    const wallCollisionRight = this.matter.add.rectangle(2120, 0, 10, 6000, { isStatic: true, label: "paredes" });

    const wall_1 = this.matter.add.rectangle(875, 1470, 10, 220, { isStatic: true, label: "paredes" });
    const wall_2 = this.matter.add.rectangle(950, 1470, 10, 220, { isStatic: true, label: "paredes" });
    const wall_3 = this.matter.add.rectangle(1210, 1470, 10, 300, { isStatic: true, label: "paredes" });
    const wall_4 = this.matter.add.rectangle(1285, 1470, 10, 300, { isStatic: true, label: "paredes" });
    const wall_5 = this.matter.add.rectangle(1690, 1520, 10, 120, { isStatic: true, label: "paredes" });
    const wall_6 = this.matter.add.rectangle(1765, 1520, 10, 120, { isStatic: true, label: "paredes" });
    const wall_7 = this.matter.add.rectangle(730, 2030, 10, 50, { isStatic: true, label: "paredes" });
    const wall_8 = this.matter.add.rectangle(850, 2030, 10, 50, { isStatic: true, label: "paredes" });
    const wall_9 = this.matter.add.rectangle(1020, 2030, 10, 70, { isStatic: true, label: "paredes" });
    const wall_10 = this.matter.add.rectangle(1095, 2030, 10, 70, { isStatic: true, label: "paredes" });
    const wall_11 = this.matter.add.rectangle(1835, 2560, 10, 70, { isStatic: true, label: "paredes" });
    const wall_12 = this.matter.add.rectangle(1355, 950, 10, 120, { isStatic: true, label: "paredes" });
    const wall_13 = this.matter.add.rectangle(1045, 950, 10, 120, { isStatic: true, label: "paredes" });
    const wall_14 = this.matter.add.rectangle(1830, 480, 10, 100, { isStatic: true, label: "paredes" });
    
    createWall(this, wallCollisionLeft);
    createWall(this, wallCollisionRight);
    createWall(this, wall_1);
    createWall(this, wall_2);
    createWall(this, wall_3);
    createWall(this, wall_4);
    createWall(this, wall_5);
    createWall(this, wall_6);
    createWall(this, wall_7);
    createWall(this, wall_8);
    createWall(this, wall_9);
    createWall(this, wall_10);
    createWall(this, wall_11);
    createWall(this, wall_12);
    createWall(this, wall_13);
    createWall(this, wall_14);

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");

    this.player = new Knight(this, {x: data.x, y: data.y}, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");
    
    this.camera.startFollow(this.player, true, 0.08, 0.08, 80);

    // Traps collision
    this.matter.world.on("collisionstart", (event) => {
      this.player.trapCollider(event, this);

      for(const enemy of this.enemies) {
        enemy.trapCollider(event, this);
      }
    });  
  }

  update() {
    super.update(this);

    const trigger = this.map.findObject("treasure", (obj) => obj.name === "trigger");

    if(this.player.y > trigger.y && !this.in_treasure_room) {
      this.in_treasure_room = true;

      const camera = this.map.findObject("treasure", (obj) => obj.name == 5);

      this.scale.resize(1280, camera.properties[0].value);
      this.camera.setBounds(camera.x, camera.y, camera.properties[1].value, camera.properties[0].value);

      this.camera.fadeOut(10000, 0, 0, 0);

      this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        this.scene.start("start");
      });
    }
  }
}


export default TreasureRoom;
