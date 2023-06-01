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
    this.load.image("tiles", "assets/tilesets/tiles.png");
    this.load.image('door_1(7px)', 'assets/tilesets/door_1(7px).png');
    this.load.image('barril', 'assets/tilesets/barrel_1(0px).png');
    this.load.image('escada', 'assets/tilesets/ladder(7px).png');
    this.load.image('door_2(14px)', 'assets/tilesets/door_2(14px).png');
    this.load.image('torch(7px)', 'assets/tilesets/torch(7px).png');
    this.load.image('window(19px)', 'assets/tilesets/window(19px).png');
    this.load.image('ladder_middle(0px)', 'assets/tilesets/ladder_middle(0px).png');

    // Load characters
    this.load.atlas("knight", "../assets/character/knight/atlas/knight.png", "../assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "../assets/character/knight/physics/knight.json");
  }

  create(data) {
    // Create map
    this.map = this.make.tilemap({ key: "map1" });

    // Create tiles
    const blocks = this.map.addTilesetImage("ts1", "tiles");
    const closed_door_tile = this.map.addTilesetImage("door_1(7px)", "door_1(7px)");
    const stairs_tiles = this.map.addTilesetImage("ladder(7px)", "escada");
    const barrel_tile = this.map.addTilesetImage("barrel(1px)", "barril");
    const opened_door_tile = this.map.addTilesetImage("door_2(14px)", "door_2(14px)");
    const torch_tile = this.map.addTilesetImage("torch(7px)", "torch(7px)");
    const ladder_middle_tile = this.map.addTilesetImage("ladder_middle(0px)", "ladder_middle(0px)");
    const window_tile = this.map.addTilesetImage("window(19px)", "window(19px)");
    
    // Create layers
    const inner_background = this.map.createLayer("fundo_interno", blocks, 0, 0);
    const outside_background = this.map.createLayer("fundo", blocks, 0, 0);
    const closed_door = this.map.createLayer("porta_fechada", closed_door_tile, 0, 0);
    const opened_door = this.map.createLayer("porta_aberta", opened_door_tile, 0, 0);
    const stairs = this.map.createLayer("escadas", stairs_tiles, 0, 0);
    const barrels = this.map.createLayer("barris", barrel_tile, 0, 0);
    const torchs = this.map.createLayer("tochas", torch_tile, 0, 0);
    const middle_ladder = this.map.createLayer("escada_meio", ladder_middle_tile, 0, 0);
    const windows = this.map.createLayer("janelas", window_tile, 0, 0);
    const blockLayer = this.map.createLayer("blocklayer", blocks, 0, 0);

    // Create camera
    const camera = this.cameras.main;
    camera.setBounds(0, 0, 2100, 400);
    
    // Set collision
    blockLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(blockLayer);
    
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