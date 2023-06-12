import { setCollision } from "../utils/config.js";
import { createLayer } from "../utils/config.js";
import collide from "../utils/helper.js";

import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";
import King from "../characters/king.js";

class Map1 extends Phaser.Scene {
  map;
  blocks;
  wall_layer;
  barrel_layer;
  block_layer;
  trap_layer;
  camera;
  floor;
  cursors;
  pointer;
  knight;
  enemies;
  king;

  constructor() {
    super({
      key: "Map1", 
      physics: {
        matter: {},
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
      }
    });
  }

  init() {
    this.camera = this.cameras.main;
    this.floor = 0;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    // Load images
    this.load.image("tileset", "assets/tilesets/tileset.png");
    this.load.atlas("heart", "../assets/icons/atlas/heart.png", "../assets/icons/atlas/heart.json");

    // Load character assets
    this.load.atlas("knight", "../assets/character/knight/atlas/knight.png", "../assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "../assets/character/knight/physics/knight.json");
    this.load.atlas("warrior", "../assets/character/warrior/atlas/warrior.png", "../assets/character/warrior/atlas/warrior.json");
    this.load.json("warrior_physics", "../assets/character/warrior/physics/warrior.json");
    this.load.atlas("king", "../assets/character/king/atlas/king.png", "../assets/character/king/atlas/king.json");
    this.load.json("king_physics", "../assets/character/king/physics/king.json");
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
    this.knight = new Knight(this, 200, 200, "knight", "knight_idle-0.png", "knight_physics");
    
    let enemy_id = 0;
    this.enemies = [];

    for(let i=0; i<4; i++) {
      this.enemies.push(new Warrior(this, i*100+250, 200, "warrior", "warrior_idle-0.png", "warrior_physics", enemy_id++));
    }
    this.king = new King(this, 150, 200, "king", "king_idle-0.png", "king_physics", 1);
    this.enemies.push(this.king);
    this.knight.resetHitbox(this);   
    
    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.knight, true, 0.08, 0.08, 80);
    
    // Ladder climbing logic
    const ladder_layer = this.map.getLayer("escadas");
    const ladder_tiles = ladder_layer.tilemapLayer.getTilesWithin();

    const coords = [];
    ladder_tiles.forEach(tile => {
      if(tile.index === 8 || tile.index === 9 || tile.index === 47) {
        coords.push({ x: tile.pixelX, y: tile.pixelY, height: 48, width: 48 });
      }
    });

    this.matter.world.on('beforeupdate', () => {
      coords.forEach((position) => {
        if(collide(this.knight, position, 10, 1.05)) {
          this.matter.world.setGravity(0, -1);

          if(this.input.keyboard.addKey('W').isDown) {
            this.knight.climb("up");

          } else if(this.input.keyboard.addKey('S').isDown) {
            this.knight.climb("down");
          }
        }

        this.matter.world.setGravity(0, 1);
      });
    });
  }
  
  update() {
    // Character movement
    if(this.pointer.isDown) {
      this.knight.attack(this);
      this.king.ground_attack(this);

    } else if(this.input.keyboard.addKey('A').isDown) {
      this.knight.walk("left");

    } else if(this.input.keyboard.addKey('D').isDown) {
      this.knight.walk("right");

    } else {
      this.knight.idle();
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if(spaceJustPressed) {
      this.knight.jump(this);
      // this.knight.get_hit(1);
    }

    // Camera transitions
    if(this.knight.y > 0 && this.knight.y < 528 && this.floor !== 0) {
      this.camera.setBounds(0, 48, 2112, 480);
      this.floor = 0;

    } else if(this.knight.y >= 528 && this.knight.y < 912 && this.floor !== 1) {
      this.camera.setBounds(0, 480, 2112, 480);
      this.floor = 1;

    } else if(this.knight.y >= 912 && this.knight.y < 1344 && this.floor !== 2) {
      this.camera.setBounds(0, 910, 2112, 480);
      this.floor = 2;

    } else if(this.knight.y >= 1344 && this.knight.y < 1920 && this.floor !== 3) {
      this.camera.setBounds(0, 1350, 2112, 570);
      this.floor = 3;
    }
  }
}

export default Map1;
