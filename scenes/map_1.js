import { setCollision } from "../utils/config.js";
import { createLayer } from "../utils/config.js";

import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";

class Map1 extends Phaser.Scene {
  blocks;
  cursors;
  pointer;
  map;
  knight;
  camera;
  floor;

  constructor() {
    super({
      key: "Map1", physics: {
        matter: {
          debug: true
        },
        arcade: {
          debug: true,
          gravity: { y: 0 }
        }
      }
    });
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
    this.load.atlas("warrior", "../assets/character/warrior/atlas/warrior.png", "../assets/character/warrior/atlas/warrior.json");
    this.load.json("warrior_physics", "../assets/character/warrior/physics/warrior.json");
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
    this.warrior = new Warrior(this, 250, 200, "warrior", "warrior_idle-0.png", "warrior_physics");

    //hitbox
    this.swordHitbox1 = this.add.rectangle(this.knight.x + 15, this.knight.y - 10, 30, 6);
    this.physics.add.existing(this.swordHitbox1);
    this.swordHitbox2 = this.add.circle(this.knight.x + 15, this.knight.y - 10, 15);
    this.physics.add.existing(this.swordHitbox2);
    this.swordHitbox2.body.setCircle(15);
    this.swordHitbox1.body.enable = false;
    this.physics.world.remove(this.swordHitbox1.body);
    this.swordHitbox2.body.enable = false;
    this.physics.world.remove(this.swordHitbox2.body);

    //hit
    this.canHit = true;

    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.knight, true, 0.08, 0.08, 80);        
  }

  update() {

    if (this.cursors.space.isDown) {

      this.knight.attack();
      // TODO: move sword swing hitbox into place
      // does it need to start part way into the animation?
     
      const startHit = (anim, frame) => {

        if(frame.index >= 5 && frame.index <= 10) {
          this.swordHitbox1.x = this.knight.flipX
            ? this.knight.x - 30
            : this.knight.x + 30;

          this.swordHitbox1.y = this.knight.y - 5;
          this.swordHitbox1.body.enable = true;

          this.physics.world.add(this.swordHitbox1.body);

          let hit = false;
         
          if(
            this.warrior.x < this.swordHitbox1.x + this.swordHitbox1.width &&
            this.warrior.x + this.warrior.width > this.swordHitbox1.x &&
            this.warrior.y < this.swordHitbox1.y + this.swordHitbox1.height &&
            this.warrior.y + this.warrior.height > this.swordHitbox1.y
          ) {

            if(this.canHit) {
              console.log('hit'); 
            }

            this.canHit = false;
          }

        } else if(frame.index > 10) {
          this.swordHitbox2.x = this.knight.flipX
            ? this.knight.x - 30
            : this.knight.x + 30;

          this.swordHitbox2.y = this.knight.y - 5;
          this.swordHitbox2.body.enable = true;

          this.physics.world.add(this.swordHitbox2.body);
        }

        this.knight.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
      }

      this.knight.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

      this.knight.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'attack', () => {
        this.swordHitbox1.body.enable = false;
        this.physics.world.remove(this.swordHitbox1.body);
        this.swordHitbox2.body.enable = false;
        this.physics.world.remove(this.swordHitbox2.body);
        this.canHit = true;
      });

      this.knight.once(Phaser.Animations.Events.ANIMATION_STOP, () => {
        this.swordHitbox1.body.enable = false;
        this.physics.world.remove(this.swordHitbox1.body);
        this.swordHitbox2.body.enable = false;
        this.physics.world.remove(this.swordHitbox2.body);
        this.canHit = true;
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
