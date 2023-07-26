import { createLayer, createWall } from "../utils/config.js";

import Map from "./classes/map.js";
import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";
import King from "../characters/king.js";
import Archer from "../characters/archer.js";
import PlayerController from "../state_machine/player/controller/playerController.js";
import EnemyController from "../state_machine/enemy/controller/enemyController.js";

class Map1 extends Map {  
  player;
  player_spawn;
  player_controller;
  enemies;
  projectiles;
  scene_active = true;
  king_killed = false;

  constructor() {
    super("map1", "map1");
  }

  init() {
    super.init();
  
    this.enemies = [];
    this.projectiles = [];

    this.scene_active = true;
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
    this.camera.fadeIn(1000, 0, 0, 0); 

    super.create();

    createLayer(this, "porta_fechada");
    createLayer(this, "porta_aberta");
    createLayer(this, "tochas");
    createLayer(this, "janelas");
    
    const wallCollisionLeft = this.matter.add.rectangle(40, 0, 10, 3840, { isStatic: true, label: "paredes" });
    const wallCollisionRight = this.matter.add.rectangle(2070, 0, 10, 3840, { isStatic: true, label: "paredes" });

    createWall(this, wallCollisionLeft);
    createWall(this, wallCollisionRight);

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");
    this.player = new Knight(this, this.player_spawn, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");
    
    this.camera.startFollow(this.player, true, 0.08, 0.08, 80);

    const king_spawn = this.map.findObject("king_spawn", (obj) => obj.name === "king_spawn");
    const king = new King(0, this, king_spawn, "king", "king_idle-0.png", "king_physics", 10, 1, 48, 40);

    this.enemies.push(king);

    let enemy_id = 0;

    for(let i=1; i<=6; i++) {
      const spawn = this.map.findObject("archer_spawn", (obj) => obj.name === `spawn_${i}`);
      const archer = new Archer(enemy_id++, this, spawn, "archer", "archer_idle-0.png", "archer_physics", 3, 1.5, "arrow", 48, 30);

      this.enemies.push(archer);
    }

    for(let i=1; i<=7; i++) {
      const spawn = this.map.findObject("warrior_spawn", (obj) => obj.name === `spawn_${i}`);
      const warrior = new Warrior(enemy_id++, this, spawn, "warrior", "warrior_idle-0.png", "warrior_physics", 3, 1.5, 48, 30);

      this.enemies.push(warrior);
    }

    for(const enemy of this.enemies) {
      enemy.controller = new EnemyController(this, enemy, this.player);
      enemy.controller.setState("idle");
    }

    // Traps collision
    this.matter.world.on("collisionstart", (event) => {
      this.player.trapCollider(event, this);

      for(const enemy of this.enemies) {
        enemy.trapCollider(event, this);
      }
    });  
  }

  update() {
    if(this.scene_active){
      super.update(this); 
       
      if(this.player.x <= this.final_door.x && this.player.y >= this.final_door.y && this.king_killed) {
        this.scene_active = false;
        this.destroy();        
      }
    }
  }  

  destroy() {
    // this.physics.world.shutdown();

    // const bodies = this.matter.world.getAllBodies();

    // bodies.forEach((body) => {
    //   this.matter.world.remove(body);
    // });

    // // Destroy all game objects
    // const gameObjects = this.children.getChildren();

    // gameObjects.forEach((gameObject) => {
    //   gameObject.destroy();
    // });

    this.camera.fadeOut(400, 0, 0, 0);
    
    this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.start("map2");
    });
  }
}

export default Map1;
