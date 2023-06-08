import { setCollision } from "../utils/config.js";
import { createLayer } from "../utils/config.js";

import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";

class Map1 extends Phaser.Scene {
  blocks;
  cursors;
  pointer;
  map;
  blockLayer;
  traps;
  barrels;
  knight;
  camera;
  floor;

  constructor() {
    super({
      key: "Map1", physics: {
        matter: {},
        arcade: {
          debug: false,
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
    createLayer(this, "escada_meio");
    createLayer(this, "tochas");
    createLayer(this, "janelas");
    
    this.blockLayer = createLayer(this, "blocklayer");
    this.traps = createLayer(this, "armadilhas");
    this.barrels = createLayer(this, "barris");

    // Set collisions
    setCollision(this, this.blockLayer);
    setCollision(this, this.traps);
    setCollision(this, this.barrels);

    const layer = this.map.getLayer("escada_meio");

    // Get the tiles within the layer
    const tiles = layer.tilemapLayer.getTilesWithin();

    this.coords = []
    // Iterate over the tiles and log their positions
    tiles.forEach(tile => {

      if(tile.index === 9) {
        this.coords.push({x: tile.pixelX, y: tile.pixelY, height: 48, width: 48});
      }
    });

    // Create characters
    this.knight = new Knight(this, 200, 200, "knight", "knight_idle-0.png", "knight_physics");
    this.warrior = new Warrior(this, 250, 200, "warrior", "warrior_idle-0.png", "warrior_physics");

    //hitbox
    this.swordHitbox1 = this.add.rectangle(
      this.knight.x + 15,
      this.knight.y - 10,
      30,
      6
    );

    this.physics.add.existing(this.swordHitbox1);
    this.swordHitbox2 = this.add.circle(
      this.knight.x + 15,
      this.knight.y - 10,
      15
    );

    this.physics.add.existing(this.swordHitbox2);
    this.swordHitbox2.body.setCircle(15);
    this.swordHitbox1.body.enable = false;
    this.physics.world.remove(this.swordHitbox1.body);
    this.swordHitbox2.body.enable = false;
    this.physics.world.remove(this.swordHitbox2.body);

    //hit
    this.canHit = true;
    this.canHit2 = true;

    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.knight, true, 0.08, 0.08, 80);

    this.matter.world.on('beforeupdate', () => {
      this.coords.forEach((position) => {
        if (this.collide(this.knight, position, 10, 1.05)) {
         
          
          if(this.cursors.up.isDown){
            this.knight.setVelocityY(0);
            this.matter.world.setGravity(0, -1);
            this.knight.y -= 1;

          } else if(this.cursors.down.isDown){
            this.knight.setVelocityY(0);
            this.matter.world.setGravity(0, -1);
            this.knight.y += 2;
          }
        }
        this.matter.world.setGravity(0, 1);

      });
    });
  }

  update() {
    const speed = 2.5;

    if (this.pointer.isDown) {
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

          if(this.collide(this.warrior, this.swordHitbox1, 2, 1.05)) {

            if (this.canHit) {
              console.log("hit");
              this.warrior.get_hit();
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

          if(this.collide(this.warrior, this.swordHitbox1, 2, 1.05)) {

            if (this.canHit2) {
              this.warrior.get_hit();
            }
            this.canHit2 = false;
          }
        }

        this.knight.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
      };

      this.knight.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

      this.knight.once(
        Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "knight_attack",
        () => {
          this.swordHitbox1.body.enable = false;
          this.physics.world.remove(this.swordHitbox1.body);
          this.swordHitbox2.body.enable = false;
          this.physics.world.remove(this.swordHitbox2.body);
          this.canHit = true;
          this.canHit2 = true;
        }
      );
      this.knight.once(Phaser.Animations.Events.ANIMATION_STOP, () => {
        this.swordHitbox1.body.enable = false;
        this.physics.world.remove(this.swordHitbox1.body);
        this.swordHitbox2.body.enable = false;
        this.physics.world.remove(this.swordHitbox2.body);
        this.canHit = true;
        this.canHit2 = true;
      });

    } else if (this.cursors.left.isDown) {
      this.knight.walk("left");

    } else if (this.cursors.right.isDown) {
      this.knight.walk("right");

    } else {
      this.knight.idle();
    }

    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);

    if (this.cursors.space.isDown) {
      this.matter.world.once("collisionactive", (event) => {
        event.pairs.forEach((pair) => {
          const { bodyA, bodyB } = pair;
          if (
            (bodyA.label === "knight" || bodyB.label === "knight") &&
            (bodyA.gameObject.tile?.layer.name === this.blockLayer.layer.name ||
              bodyB.gameObject.tile?.layer.name ===
                this.blockLayer.layer.name ||
              bodyA.gameObject.tile?.layer.name === this.barrels.layer.name ||
              bodyB.gameObject.tile?.layer.name === this.barrels.layer.name ||
              bodyA.gameObject.tile?.layer.name === this.traps.layer.name ||
              bodyB.gameObject.tile?.layer.name === this.traps.layer.name)
          ) {
            this.knight.jump();
          }
        });
      });
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

  collide(object1, object2, multiplicador1, multiplicador2) {
    return (
      object1.x < object2.x + object2.width &&
      object1.x + object1.width / (multiplicador1 * 2) > object2.x &&
      object1.y / multiplicador2 < object2.y + object2.height &&
      object1.y + object1.height / multiplicador1 > object2.y
    );
  }
}

export default Map1;
