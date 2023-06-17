import { setCollision } from "../utils/config.js";
import { createLayer } from "../utils/config.js";
import collide from "../utils/helper.js";

import Knight from "../characters/knight.js";
import Warrior from "../characters/warrior.js";
import King from "../characters/king.js";
import Archer from "../characters/archer.js";
import Arrow from "../characters/arrow.js";

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
  arrows;

  constructor() {
    super({
      key: "Map1",
      physics: {
        matter: {
          debug: false,
        },
        arcade: {
          debug: false,
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
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON("map1", "assets/tilesets/map1.json");

    // Load images
    this.load.image("arrow", "/assets/character/archer/attack/archer_arrow.png");
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
    const player_spawn = this.map.findObject("player_spawn", obj => obj.name === "player_spawn");

    this.knight = new Knight(this, player_spawn.x, player_spawn.y, "knight", "knight_idle-0.png", "knight_physics", 6, 2.5); 

    const king_spawn = this.map.findObject("king_spawn", obj => obj.name === "king_spawn");

    this.king = new King(this, king_spawn.x, king_spawn.y, "king", "king_idle-0.png", "king_physics", 1);
    this.enemies.push(this.king);

    let enemy_id = 0;

    for(let i=1; i<=5; i++) {
        const spawn = this.map.findObject("archer_spawn", obj => obj.name === `spawn_${i}`);
        this.enemies.push(new Archer(this, spawn.x, spawn.y, "archer", "archer_idle-0.png", "archer_physics", enemy_id++));
    }

    for(let i=1; i<=6; i++) {
        const spawn = this.map.findObject("warrior_spawn", obj => obj.name === `spawn_${i}`);
        this.enemies.push(new Warrior(this, spawn.x, spawn.y, "warrior", "warrior_idle-0.png", "warrior_physics", enemy_id++));
    }

    // Set camera
    this.camera.setBounds(0, 48, 2112, 480);
    this.camera.startFollow(this.knight, true, 0.08, 0.08, 80);

    // Ladder climbing logic
    const ladder_layer = this.map.getLayer("escadas");
    const ladder_tiles = ladder_layer.tilemapLayer.getTilesWithin();

    const coords = [];

    ladder_tiles.forEach((tile) => {
      if (tile.index === 8 || tile.index === 9 || tile.index === 47) {
        coords.push({ x: tile.pixelX, y: tile.pixelY, height: 48, width: 48 });
      }
    });
    this.arrows = [];

    this.matter.world.on("beforeupdate", () => {
      coords.forEach((position) => {
        if (collide(this.knight, position, 10, 1.05)) {
          this.matter.world.setGravity(0, -1);

          if (this.input.keyboard.addKey("W").isDown) {
            this.knight.climb("up");
          } else if (this.input.keyboard.addKey("S").isDown) {
            this.knight.climb("down");
          }
        }

        this.matter.world.setGravity(0, 1);
      });
    });
  }

  update() {
    // Character movement
    if (this.knight.hearts > 0) {
      if (this.pointer.isDown) {
        this.knight.attack("knight_attack", this, this.knight.hitboxes);

      } else if (this.input.keyboard.addKey("A").isDown) {
        this.knight.walk("knight_walk", "left");

      } else if (this.input.keyboard.addKey("D").isDown) {
        this.knight.walk("knight_walk", "right");

      } else {
        this.knight.idle("knight_idle");
      }

      const spaceJustPressed = Phaser.Input.Keyboard.JustDown(
        this.cursors.space
      );

      if (spaceJustPressed) {
        this.knight.jump(this);
      }
    }

    // Camera transitions
    if (this.knight.y > 0 && this.knight.y < 528 && this.floor !== 0) {
      this.camera.setBounds(0, 48, 2112, 480);
      this.floor = 0;

    } else if (this.knight.y >= 528 && this.knight.y < 912 && this.floor !== 1) {
      this.camera.setBounds(0, 480, 2112, 480);
      this.floor = 1;

    } else if (this.knight.y >= 912 && this.knight.y < 1344 && this.floor !== 2) {
      this.camera.setBounds(0, 910, 2112, 480);
      this.floor = 2;

    } else if (this.knight.y >= 1344 && this.knight.y < 1920 && this.floor !== 3) {
      this.camera.setBounds(0, 1350, 2112, 570);
      this.floor = 3;
    }

    // Enemy AI
    for(const enemy of this.enemies) {
      const distance = Phaser.Math.Distance.Between(this.knight.x, this.knight.y, enemy.x, enemy.y);

      if(distance < 50 && !enemy.isAttackAnimationDone) {
        enemy.attack(this);

      } else if(enemy.isAttackAnimationDone) {
        enemy.walk(this);

        if(distance < 50) {
          enemy.isAttackAnimationDone = false;
        }
      }
    }

    // Traps collision
    this.matter.world.once("collisionstart", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (
          (bodyA.label === "knight" || bodyB.label === "knight") &&
          (bodyA.gameObject.tile?.layer.name === this.trap_layer.layer.name ||
            bodyB.gameObject.tile?.layer.name === this.trap_layer.layer.name)
        ) {
          if (!this.knight.is_colliding_with_trap) {
            this.knight.getHit(0.5);
            this.knight.is_colliding_with_trap = true;
          }
          setTimeout(() => {
            this.knight.is_colliding_with_trap = false;
          }, "1000");
        }
      });
    });

    this.arrows.forEach((arrow) => {
      arrow.update();
    });
  }
}

export default Map1;
