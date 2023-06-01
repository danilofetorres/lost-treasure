import * as cfg from "../utils/config.js";

class Map1 extends Phaser.Scene {
  
  cursors;
  necromancer;

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
    this.load.atlas("necromancer", "../assets/character/necromancer/atlas/necromancer.png", "../assets/character/necromancer/atlas/necromancer.json");
    this.load.json("necromancer_physics", "../assets/character/necromancer/physics/necromancer.json");
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
    const necromancerPhysics = this.cache.json.get("necromancer_physics");
    this.necromancer = this.matter.add.sprite(200, 200, "necromancer", "necromancer_idle-0.png", { shape: necromancerPhysics.necromancer });
    this.necromancer.setScale(1.5);
    this.necromancer.setFixedRotation();
    this.necromancer.depth = 1

    camera.startFollow(this.necromancer, true, 0.08, 0.08);
    
    // Create animations
    this.anims.create(cfg.anims(this, "idle", "necromancer", 49));
    this.anims.create(cfg.anims(this, "walk", "necromancer", 9));
    this.anims.create(cfg.anims(this, "jump", "necromancer", 11));   
  }
  
  update(time, delta) {
    const speed = 2;

    if(this.cursors.left.isDown) {
      this.necromancer.flipX = true;
      this.necromancer.setVelocityX(-speed);
      this.necromancer.play("walk", true);

    } else if(this.cursors.right.isDown) {
      this.necromancer.flipX = false;
      this.necromancer.setVelocityX(speed);
      this.necromancer.play("walk", true);

    } else {
      this.necromancer.setVelocityX(0);
      this.necromancer.play("idle", true);
    }

    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if(upJustPressed) {
      this.necromancer.setVelocityY(-7);
    } 
  }
}

export default Map1;