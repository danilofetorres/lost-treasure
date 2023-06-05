import * as cfg from "../utils/config.js";

class Map1 extends Phaser.Scene {
  
  cursors;
  knight;

  constructor() {
    super("Map1");
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    // Load images
    this.load.image("tileset", "assets/tilesets/tileset.png");


    // Load characters
    this.load.atlas("knight", "../assets/character/knight/atlas/knight.png", "../assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "../assets/character/knight/physics/knight.json");
  }

  create(data) {
    // Create map
    this.map = this.make.tilemap({ key: "map1" });

    // Create tiles
    const blocks = this.map.addTilesetImage("tileset", "tileset");

    
    // Create layers
    const inner_background = this.map.createLayer("fundo_interno", blocks, 0, 0);
    const outside_background = this.map.createLayer("fundo", blocks, 0, 0);
    const closed_door = this.map.createLayer("porta_fechada", blocks, 0, 0);
    const opened_door = this.map.createLayer("porta_aberta", blocks, 0, 0);
    const stairs = this.map.createLayer("escadas", blocks, 0, 0);
    const barrels = this.map.createLayer("barris", blocks, 0, 0);
    const torchs = this.map.createLayer("tochas", blocks, 0, 0);
    const middle_ladder = this.map.createLayer("escada_meio", blocks, 0, 0);
    const windows = this.map.createLayer("janelas", blocks, 0, 0);
    const traps = this.map.createLayer("armadilhas", blocks, 0, 0);
    const blockLayer = this.map.createLayer("blocklayer", blocks, 0, 0);

    // Create camera
    const camera = this.cameras.main;
    camera.setBounds(0, 0, 2100, 400);
    
    // Set collision
    blockLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(blockLayer);

    traps.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(traps);

    barrels.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(barrels);
    
    // Create characters
    const knightPhysics = this.cache.json.get("knight_physics");
    this.knight = this.matter.add.sprite(200, 200, "knight", "knight_idle-0.png", { shape: knightPhysics.knight });
    this.knight.setScale(1.5);
    this.knight.setFixedRotation();
    this.knight.depth = 1

    camera.startFollow(this.knight, true, 0.08, 0.08);
    
    // Create animations
    this.anims.create(cfg.anims(this, "idle", "knight", 14));
    this.anims.create(cfg.anims(this, "walk", "knight", 7));
    this.anims.create(cfg.anims(this, "jump", "knight", 13));   
  }
  
  update(time, delta) {
    const speed = 2;

    if(this.cursors.left.isDown) {
      this.knight.flipX = true;
      this.knight.setVelocityX(-speed);
      this.knight.play("walk", true);

    } else if(this.cursors.right.isDown) {
      this.knight.flipX = false;
      this.knight.setVelocityX(speed);
      this.knight.play("walk", true);

    } else {
      this.knight.setVelocityX(0);
      this.knight.play("idle", true);
    }

    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if(upJustPressed) {
      this.knight.setVelocityY(-7);
    } 
  }
}

export default Map1;