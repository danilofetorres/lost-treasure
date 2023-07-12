import * as stopwatch from "../utils/stopwatch.js";
import Map from "./classes/map.js";
import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";
import King from "../characters/king.js";
import Archer from "../characters/archer.js";
import PlayerController from "../state_machine/player/controller/playerController.js";
import EnemyController from "../state_machine/enemy/controller/enemyController.js";

class Map1 extends Map {  
  camera;
  floor;
  player;
  player_spawn;
  player_controller;
  enemies;
  arrows;

  constructor() {
    super("map1");
  }

  init() {
    super.init();

    this.floor = 0;
    this.camera = this.cameras.main;
  
    this.enemies = [];
    this.arrows = [];
  }

  preload() {
    super.preload();

    // Load character assets
    this.load.atlas("knight", "assets/character/knight/atlas/knight.png", "assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "assets/character/knight/physics/knight.json");
    this.load.atlas("warrior", "assets/character/warrior/atlas/warrior.png", "assets/character/warrior/atlas/warrior.json");
    this.load.json("warrior_physics", "assets/character/warrior/physics/warrior.json");
    this.load.atlas("king", "assets/character/king/atlas/king.png", "assets/character/king/atlas/king.json");
    this.load.json("king_physics", "assets/character/king/physics/king.json");
    this.load.atlas("archer", "assets/character/archer/atlas/archer.png", "assets/character/archer/atlas/archer.json");
    this.load.json("archer_physics", "assets/character/archer/physics/archer.json");
  }

  create() {
    super.create();

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");
    this.player = new Knight(this, this.player_spawn, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");

    const king_spawn = this.map.findObject("king_spawn", (obj) => obj.name === "king_spawn");
    const king = new King(0, this, king_spawn, "king", "king_idle-0.png", "king_physics", 10, 1, 48, 40);

    this.enemies.push(king);

    let enemy_id = 0;

    for(let i=1; i<=5; i++) {
      const spawn = this.map.findObject("archer_spawn", (obj) => obj.name === `spawn_${i}`);
      const archer = new Archer(enemy_id++, this, spawn, "archer", "archer_idle-0.png", "archer_physics", 3, 1.5, "arrow", 48, 30);

      this.enemies.push(archer);
    }

    for(let i=1; i<=5; i++) {
      const spawn = this.map.findObject("warrior_spawn", (obj) => obj.name === `spawn_${i}`);
      const warrior = new Warrior(enemy_id++, this, spawn, "warrior", "warrior_idle-0.png", "warrior_physics", 3, 1.5, 48, 30);

      this.enemies.push(warrior);
    }

    for(const enemy of this.enemies) {
      enemy.controller = new EnemyController(this, enemy, this.player);
      enemy.controller.setState("idle");
    }

    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.player, true, 0.08, 0.08, 80);

    this.matter.world.on("beforeupdate", () => {
      this.player.ladderCollider(this);
    });

    // Traps collision
    this.matter.world.on("collisionstart", (event) => {
      this.player.trapCollider(event, this);

      for(const enemy of this.enemies) {
        enemy.trapCollider(event, this);
      }
    });  

    stopwatch.startTimer(this);
  }

  update() {
    super.update(this); 

    // Camera transitions
    if(this.player.y > 0 && this.player.y < 528 && this.floor !== 0) {
      this.camera.setBounds(0, 48, 2112, 480);
      this.floor = 0;

    } else if(this.player.y >= 528 && this.player.y < 912 && this.floor !== 1) {
      this.camera.setBounds(0, 480, 2112, 480);
      this.floor = 1;

    } else if(this.player.y >= 912 && this.player.y < 1344 && this.floor !== 2) {
      this.camera.setBounds(0, 910, 2112, 480);
      this.floor = 2;

    } else if(this.player.y >= 1344 && this.player.y < 1920 && this.floor !== 3) {
      this.camera.setBounds(0, 1350, 2112, 570);
      this.floor = 3;
    }
  }  
}

export default Map1;
