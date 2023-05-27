import * as cfg from "../utils/config.js";

class Map1 extends Phaser.Scene {
  constructor() {
    super("Map1");
  }

  Init() {}

  preload() {
    this.load.image("tiles", "assets/tilesets/tiles.png");
    this.load.image('door_1(7px)', 'assets/tilesets/door_1(7px).png');
    this.load.image('barril', 'assets/tilesets/barrel_1(0px).png');
    this.load.image('escada', 'assets/tilesets/ladder(7px).png');
    this.load.image('door_2(14px)', 'assets/tilesets/door_2(14px).png');
    this.load.image('torch(7px)', 'assets/tilesets/torch(7px).png');
    this.load.image('window(19px)', 'assets/tilesets/window(19px).png');
    this.load.image('ladder_middle(0px)', 'assets/tilesets/ladder_middle(0px).png');

    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    this.load.spritesheet(cfg.sheet("player", "assets/character/player/idle/player_idle.png", 170, 96, 14));
    this.load.spritesheet(cfg.sheet("knight", "assets/character/knight/idle/knight_idle.png", 64, 64, 14));
    this.load.spritesheet(cfg.sheet("warrior", "assets/character/warrior/idle/warrior_idle.png", 96, 96, 20));
    this.load.spritesheet(cfg.sheet("archer", "assets/character/archer/idle/archer_idle.png", 96, 96, 15));
    this.load.spritesheet(cfg.sheet("necromancer", "assets/character/necromancer/idle/necromancer_idle.png", 96, 96, 50));
    this.load.spritesheet(cfg.sheet("king", "assets/character/king/idle/king_idle.png", 128, 128, 17));
    this.load.spritesheet(cfg.sheet("archer_2", "assets/character/archer_2/idle/archer2_idle.png", 128, 128, 7));
  }

  create(data) {
    this.map = this.make.tilemap({ key: "map1" });

    const blocks = this.map.addTilesetImage("ts1", "tiles");
    const closed_door_tile = this.map.addTilesetImage("door_1(7px)", "door_1(7px)");
    const stairs_tiles = this.map.addTilesetImage("ladder(7px)", "escada");
    const barrel_tile = this.map.addTilesetImage("barrel(1px)", "barril");
    const opened_door_tile = this.map.addTilesetImage("door_2(14px)", "door_2(14px)");
    const torch_tile = this.map.addTilesetImage("torch(7px)", "torch(7px)");
    const ladder_middle_tile = this.map.addTilesetImage("ladder_middle(0px)", "ladder_middle(0px)");
    const window_tile = this.map.addTilesetImage("window(19px)", "window(19px)");

    const inner_background = this.map.createStaticLayer("fundo_interno", blocks, 0, 0);
    const outside_background = this.map.createStaticLayer("fundo", blocks, 0, 0);
    const closed_door = this.map.createStaticLayer("porta_fechada", closed_door_tile, 0, 0);
    const opened_door = this.map.createStaticLayer("porta_aberta", opened_door_tile, 0, 0);
    const stairs = this.map.createStaticLayer("escadas", stairs_tiles, 0, 0);
    const barrels = this.map.createStaticLayer("barris", barrel_tile, 0, 0);
    const blocklayer = this.map.createStaticLayer("blocklayer", blocks, 0, 0);
    const torchs = this.map.createStaticLayer("tochas", torch_tile, 0, 0);
    const middle_ladder = this.map.createStaticLayer("escada_meio", ladder_middle_tile, 0, 0);
    const windows = this.map.createStaticLayer("janelas", window_tile, 0, 0);

    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.anims.create(cfg.anims(this, "idle", "player", 14));
    this.anims.create(cfg.anims(this, "idleKnight", "knight", 14));
    this.anims.create(cfg.anims(this, "idleWarrior", "warrior", 20));
    this.anims.create(cfg.anims(this, "idleArcher", "archer", 15));
    this.anims.create(cfg.anims(this, "idleNecromancer", "necromancer", 45));
    this.anims.create(cfg.anims(this, "idleKing", "king", 17));
    this.anims.create(cfg.anims(this, "idleArcher2", "archer_2", 7));

    this.player = this.physics.add.sprite(160, 200, "player").setSize(35, 35).setOffset(63, 41);
    this.player.play("idle");

    this.knight = this.physics.add.sprite(100, 264, "knight");
    this.knight.play("idleKnight");

    this.warrior = this.physics.add.sprite(700, 264, "warrior");
    this.warrior.play("idleWarrior");

    this.archer = this.physics.add.sprite(750, 264, "archer");
    this.archer.play("idleArcher");

    this.necro = this.physics.add.sprite(800, 264, "necromancer");
    this.necro.play("idleNecromancer");

    this.king = this.physics.add.sprite(850, 264, "king");
    this.king.play("idleKing");

    this.archer2 = this.physics.add.sprite(950, 264, "archer_2");
    this.archer2.play("idleArcher2");

    this.player.setCollideWorldBounds(true);

    this.physics.world.setBounds(0, 0, 2100, 400);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, 2100, 400);
    camera.startFollow(this.player, true, 0.08, 0.08);
  }

  update(time, delta) {
    let cursors = this.input.keyboard.createCursorKeys();

    if(cursors.left.isDown || this.a.isDown || cursors.right.isDown || this.d.isDown) {
      this.player.setVelocityX(cursors.left.isDown || this.a.isDown ? -160 : 160);

    } else {
      this.player.setVelocityX(0);
    }

    if(cursors.up.isDown || this.w.isDown || cursors.down.isDown || this.s.isDown) {
      this.player.setVelocityY(cursors.up.isDown || this.w.isDown ? -160 : 160);

    } else {
      this.player.setVelocityY(0);
    }
  }
}

export default Map1;