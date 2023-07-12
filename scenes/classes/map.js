import { createWall, setCollision } from "../../utils/config.js";
import { createLayer } from "../../utils/config.js";

class Map extends Phaser.Scene {
  key;
  characters;
  map;
  blocks;
  wall_layer;
  barrel_layer;
  block_layer;
  trap_layer;
  ladder_coords;
  cursors;
  pointer;

  constructor(key) {
    super({
      key: key,
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

    this.key = key;
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

    this.ladder_coords = [];
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON(this.key, `assets/tilesets/${this.key}.json`);

    // Load images
    this.load.image("arrow", "assets/character/archer/attack/archer_arrow.png");
    this.load.image("tileset", "assets/tilesets/tileset.png");
    this.load.atlas("heart", "assets/icons/atlas/heart.png", "assets/icons/atlas/heart.json");
  }

  create() {
    // Create map
    this.map = this.make.tilemap({ key: this.key });

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

    // Invisible walls
    const wallCollisionLeft = this.matter.add.rectangle(40, 0, 10, 3840, { isStatic: true, label: "paredes" });
    const wallCollisionRight = this.matter.add.rectangle(2070, 0, 10, 3840, { isStatic: true, label: "paredes" });

    createWall(this, wallCollisionLeft);
    createWall(this, wallCollisionRight);

    // Set collisions
    setCollision(this, this.block_layer);
    setCollision(this, this.trap_layer);
    setCollision(this, this.barrel_layer);

    // Ladder coordinates
    const ladder_layer = this.map.getLayer("escadas");
    const ladder_tiles = ladder_layer.tilemapLayer.getTilesWithin();

    ladder_tiles.forEach((tile) => {
      if(tile.index === 8 || tile.index === 9 || tile.index === 47) {
        this.ladder_coords.push({
          x: tile.pixelX,
          y: tile.pixelY,
          height: 48,
          width: 48,
        });
      }
    });
  }

  update(scene) {
    scene.player_controller.update();

    // Character movement
    if(scene.player.hearts <= 0) {
      scene.player_controller.setState("die");

    } else if(this.pointer.isDown) {
      scene.player_controller.setState("attack");

    } else if(this.input.keyboard.addKey("A").isDown) {
      scene.player_controller.setState("moveLeft");

    } else if(this.input.keyboard.addKey("D").isDown) {
      scene.player_controller.setState("moveRight");

    } else {
      scene.player_controller.setState("idle");
    }

    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if(spaceJustPressed) {
      scene.player.jump(scene);
    }

    // Enemy AI
    for(const enemy of scene.enemies) {
      enemy.controller.update();
      enemy.updateHealthBar();

      const distance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, enemy.x, enemy.y);

      if(enemy.spawn.properties[0].value === scene.floor) {

        if(enemy.texture.key == "archer") {

          if(distance < 600 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("arrowAttack");

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
    scene.player.fallDamageHandlerUpdate(scene);
  }
}

export default Map;
