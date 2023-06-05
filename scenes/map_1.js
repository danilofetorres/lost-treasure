import { setCollision } from "../utils/config.js";
import { createLayer } from "../utils/config.js";

import Knight from "../characters/knight.js";

class Map1 extends Phaser.Scene {
  blocks;
  cursors;
  map;
  knight;
  camera;
  floor;

  constructor() {
    super("Map1");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.camera = this.cameras.main;
    this.floor = 0;
    this.pointer = this.input.activePointer;
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    // Load images
    this.load.image("tileset", "assets/tilesets/tileset.png");

    // Load character assets
    this.load.atlas("knight", "../assets/character/knight/atlas/knight.png", "../assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "../assets/character/knight/physics/knight.json");
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
    createLayer(this, "escada_meio");
    createLayer(this, "janelas");

    const blockLayer = createLayer(this, "blocklayer");
    const traps = createLayer(this, "armadilhas");
    const barrels = createLayer(this, "barris");
    
    // Set collisions
    setCollision(this, blockLayer);
    setCollision(this, traps);
    setCollision(this, barrels);
    
    // Create characters
    this.knight = new Knight(this, 200, 200, "knight", "knight_idle-0.png", "knight_physics");

    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.knight, true, 0.08, 0.08, 80);        
  }
  
  update() {
    // knight movimentation
    if(this.pointer.isDown){
      this.knight.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'attack', () => {
       // this.knight.play('idle')
  
        // TODO: hide and remove the sword swing hitbox
        // this.swordHitbox.body.enable = false
        // this.physics.world.remove(this.swordHitbox.body)
      });
  
    }
    
   if(this.cursors.left.isDown) {
      this.knight.walk("left");

    } else if(this.cursors.right.isDown) {
      this.knight.walk("right");
    } 
    else {
      this.knight.idle();
    }

    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if(upJustPressed) {
      this.knight.jump();
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
