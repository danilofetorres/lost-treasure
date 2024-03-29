import { setCollision, createLayer } from "../../utils/config.js";

class Map extends Phaser.Scene {
  key;
  map;
  map_key;
  camera;
  floor;
  blocks;
  wall_layer;
  barrel_layer;
  block_layer;
  trap_layer;
  cursors;
  pointer;

  constructor(key, map = key) {
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
    this.map_key = map;
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;

    this.camera = this.cameras.main;
    this.floor = 0;
  }

  preload() {
    // Load map
    this.load.tilemapTiledJSON(this.map_key, `assets/tilesets/${this.map_key}.json`);

    // Load images
    this.load.image("arrow", "assets/character/archer/attack/archer_arrow.png");
    this.load.image("tileset", "assets/tilesets/tileset.png");

    // Heart icons
    this.load.atlas("heart", "assets/icons/atlas/heart.png", "assets/icons/atlas/heart.json");
  }

  create() {
    // Create map
    this.map = this.make.tilemap({ key: this.map_key });

    // Create tiles
    this.blocks = this.map.addTilesetImage("tileset", "tileset");

    // Create layers
    createLayer(this, "fundo_interno");
    createLayer(this, "fundo");
    
    this.wall_layer = createLayer(this, "paredes");
    this.block_layer = createLayer(this, "blocklayer");
    this.trap_layer = createLayer(this, "armadilhas");
    this.barrel_layer = createLayer(this, "barris");

    // Set collisions
    setCollision(this, this.block_layer);
    setCollision(this, this.trap_layer);
    setCollision(this, this.barrel_layer);

    // Create camera
    const camera = this.map.findObject("camera", (obj) => obj.name == 0);

    this.camera.setBounds(camera.x, camera.y, camera.properties[1].value, camera.properties[0].value);
    this.scale.resize(1280, camera.properties[0].value);
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

    // Character jump
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if(spaceJustPressed) {
      scene.player.jump(scene);
    }

    // Camera transitions
    const next_camera = this.map.findObject("camera", (obj) => obj.name == this.floor + 1);

    if(next_camera != null) {

      if(this.player.y > next_camera.y) {
        const cam_width = next_camera.properties[1].value;
        const cam_height = next_camera.properties[0].value;

        this.scale.resize(1280, cam_height);
        this.camera.setBounds(next_camera.x, next_camera.y, cam_width, cam_height);

        this.floor++;
      }
    }

    // Enemy AI
    for(const enemy of scene.enemies) {
      enemy.controller.update();
      enemy.updateHealthBar();

      const distance = Phaser.Math.Distance.Between(scene.player.x, scene.player.y, enemy.x, enemy.y);

      if(enemy.spawn.properties[0].value === scene.floor) {

        if(enemy.texture.key == "archer") {

          if(distance < 600 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("projectileAttack");

          } else if(enemy.isAttackAnimationDone) {
            enemy.controller.setState("followPlayer");

            if(distance < 600) {
              enemy.isAttackAnimationDone = false;
            }
          }

        } else if(enemy.texture.key == "necromancer") {

          if(distance < 400 && distance >=200 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("projectileAttack");

          } else if(distance < 60 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("spawn");

          } else if(enemy.isAttackAnimationDone) {
            enemy.controller.setState("followPlayer");

            if(distance < 400) {
              enemy.isAttackAnimationDone = false;
            }
          }

        } else if(enemy.texture.key == "archer2") {

          if(distance < 600 && distance >=150 && !enemy.isAttackAnimationDone) {
            enemy.controller.setState("projectileAttack");

          } else if (distance < 60 && !enemy.isAttackAnimationDone){
            enemy.controller.setState("melee");

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

    // Fall damage
    scene.player.fallDamageHandlerUpdate(scene);
  }
}

export default Map;
