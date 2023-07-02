import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";
import King from "../characters/king.js";
import Archer from "../characters/archer.js";
import PlayerController from "../state_machine/player/controller/playerController.js";
import EnemyController from "../state_machine/enemy/controller/enemyController.js";

import { setCollision } from "../utils/config.js";
import { createLayer } from "../utils/config.js";

class Map1 extends Phaser.Scene {
  map;
  blocks;
  wall_layer;
  barrel_layer;
  block_layer;
  trap_layer;
  ladder_coords;
  camera;
  floor;
  cursors;
  pointer;
  player;
  player_spawn;
  player_controller;
  enemies;
  arrows;

  constructor() {
    super({
      key: "Map1",
      physics: {
        matter: {
          debug: true,
        },
        arcade: {
          debug: true,
          gravity: { y: 0 },
        },
      },
    });
  }

  init() {
    this.camera = this.cameras.main;
    this.floor = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;
    this.enemies = [];
    this.arrows = [];
    this.ladder_coords = [];
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    // Load images
    this.load.image("arrow", "assets/character/archer/attack/archer_arrow.png");
    this.load.image("tileset", "assets/tilesets/tileset.png");
    this.load.atlas("heart", "assets/icons/atlas/heart.png", "assets/icons/atlas/heart.json");

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
    // Create map
    this.map = this.make.tilemap({ key: "map1" });

    // Create tiles
    this.blocks = this.map.addTilesetImage("tileset", "tileset");

    // Create layers
    createLayer(this, "fundo_interno");
    createLayer(this, "fundo");
    createLayer(this, "porta_fechada");
    createLayer(this, "porta_aberta");
    createLayer(this, "escadas");
    createLayer(this, "tochas");
    createLayer(this, "janelas");

    this.wall_layer = createLayer(this, "paredes");
    this.block_layer = createLayer(this, "blocklayer");
    this.trap_layer = createLayer(this, "armadilhas");
    this.barrel_layer = createLayer(this, "barris");

    // Set collisions
    setCollision(this, this.wall_layer);
    setCollision(this, this.block_layer);
    setCollision(this, this.trap_layer);
    setCollision(this, this.barrel_layer);

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", obj => obj.name === "player_spawn");
    this.player = new Knight(this, this.player_spawn, "knight", "knight_idle-0.png", "knight_physics", 6, 3.5); 

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");

    const king_spawn = this.map.findObject("king_spawn", obj => obj.name === "king_spawn");
    this.enemies.push(new King(0, this, king_spawn, "king", "king_idle-0.png", "king_physics", 10, 1));

    let enemy_id = 0;

    for(let i=1; i<=5; i++) {
      const spawn = this.map.findObject("archer_spawn", obj => obj.name === `spawn_${i}`);
      this.enemies.push(new Archer(enemy_id++, this, spawn, "archer", "archer_idle-0.png", "archer_physics", 3, 1.5, "arrow"));
    }

    for(let i=1; i<=6; i++) {
      const spawn = this.map.findObject("warrior_spawn", obj => obj.name === `spawn_${i}`);
      this.enemies.push(new Warrior(enemy_id++, this, spawn, "warrior", "warrior_idle-0.png", "warrior_physics", 3, 1.5));
    }

    for(const enemy of this.enemies) {
      enemy.controller = new EnemyController(this, enemy, this.player);
      enemy.controller.setState("idle");
    }

    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.player, true, 0.08, 0.08, 80);

    // Ladder climbing logic
    const ladder_layer = this.map.getLayer("escadas");
    const ladder_tiles = ladder_layer.tilemapLayer.getTilesWithin();

    ladder_tiles.forEach((tile) => {
      if(tile.index === 8 || tile.index === 9 || tile.index === 47) {
        this.ladder_coords.push({ x: tile.pixelX, y: tile.pixelY, height: 48, width: 48 });
      }
    });
    
    
       
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
  }

  update() {
    this.player_controller.update();

    // Character movement
    if(this.player.hearts <= 0) {
      this.player_controller.setState("die");

    } else if(this.pointer.isDown) {
      this.player_controller.setState("attack");

    } else if(this.input.keyboard.addKey("A").isDown) {
      this.player_controller.setState("moveLeft");

    } else if(this.input.keyboard.addKey("D").isDown) {
      this.player_controller.setState("moveRight");

    } else {
      this.player_controller.setState("idle");
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if(spaceJustPressed) {
      this.player.jump(this);
    }
    
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

    // Enemy AI
    for(const enemy of this.enemies) {
      enemy.controller.update();

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);

      if(enemy.spawn.properties[0].value === this.floor) {

        if(enemy.texture.key == 'archer') {
  
          if(distance < 600 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("arrow_attack");
  
          } else if(enemy.isAttackAnimationDone) {
            enemy.controller.setState("followPlayer");
  
            if(distance < 600) {
              enemy.isAttackAnimationDone = false;
            }
          } 
  
        } else {
  
          if(distance < 60 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("attack");
    
          } else if(distance < 550 && enemy.isAttackAnimationDone) {
            enemy.controller.setState("followPlayer");
    
            if(distance < 60) {
             enemy.isAttackAnimationDone = false;
            }
  
          } else if(enemy.isAttackAnimationDone) {
            enemy.controller.setState("idle");
          }
        }

      } else {
        enemy.controller.setState("idle");
      }
    }
    this.player.fallDamageHandlerUpdate(this);
  }
  
}

export default Map1;
