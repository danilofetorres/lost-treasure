import { createWall, setCollision, createLayer } from "../../utils/config.js";

import Map from "./classes/map.js";
import Knight from "../characters/knight.js";
import Archer2 from "../characters/archer2.js";
import PlayerController from "../state_machine/player/controller/playerController.js";
import EnemyController from "../state_machine/enemy/controller/enemyController.js";
import Necromancer from "../characters/necromancer.js";

class Map2 extends Map {
  player;
  player_spawn;
  player_controller;
  enemies;
  projectiles;
  bloco_removivel_layer;
  archer;

  constructor() {
    super("map2");
  }

  init() {
    super.init();
  
    this.enemies = [];
    this.projectiles = [];
  }

  preload() {
    super.preload();

    // this.load.image('fundo_vermelho', 'assets/tilesets/fundo_vermelho.png');
    // this.load.image('chest(0px)', 'assets/tilesets/chest(0px).png');
    // this.load.image('coins', 'assets/tilesets/image-removebg-preview-removebg-preview.png');

    this.load.atlas(
      "knight",
      "assets/character/knight/atlas/knight.png",
      "assets/character/knight/atlas/knight.json"
    );
    this.load.json(
      "knight_physics",
      "assets/character/knight/physics/knight.json"
    );
    this.load.atlas(
      "archer2",
      "assets/character/archer_2/atlas/archer.png",
      "assets/character/archer_2/atlas/archer.json"
    );
    this.load.json(
      "archer2_physics",
      "assets/character/archer_2/physics/archer2.json"
    );
    this.load.atlas(
      "necromancer",
      "assets/character/necromancer/atlas/necromancer.png",
      "assets/character/necromancer/atlas/necromancer.json"
    );
    this.load.json(
      "necromancer_physics",
      "assets/character/necromancer/physics/necromancer.json"
    );
    this.load.image("projectile", "assets/character/necromancer/Attack/necromancer_projectile.png");
    this.load.atlas("knight", "assets/character/knight/atlas/knight.png", "assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "assets/character/knight/physics/knight.json");
    
    this.load.atlas("archer2", "assets/character/archer_2/atlas/archer.png", "assets/character/archer_2/atlas/archer.json");
    this.load.json("archer2_physics", "assets/character/archer_2/physics/archer2.json");
  }

  create() {
    super.create();

    createLayer(this, "objetos");
    createLayer(this, "baus");
    createLayer(this, "moedas");
    this.bloco_removivel_layer = createLayer(this, "bloco_removivel");

    setCollision(this, this.bloco_removivel_layer);

    const wallCollisionLeft = this.matter.add.rectangle(40, 0, 10, 6000, { isStatic: true, label: "paredes" });
    const wallCollisionRight = this.matter.add.rectangle(2120, 0, 10, 6000, { isStatic: true, label: "paredes" });

    const wall_1 = this.matter.add.rectangle(875, 1470, 10, 220, { isStatic: true, label: "paredes" });
    const wall_2 = this.matter.add.rectangle(950, 1470, 10, 220, { isStatic: true, label: "paredes" });
    const wall_3 = this.matter.add.rectangle(1210, 1470, 10, 300, { isStatic: true, label: "paredes" });
    const wall_4 = this.matter.add.rectangle(1285, 1470, 10, 300, { isStatic: true, label: "paredes" });
    const wall_5 = this.matter.add.rectangle(1690, 1520, 10, 120, { isStatic: true, label: "paredes" });
    const wall_6 = this.matter.add.rectangle(1765, 1520, 10, 120, { isStatic: true, label: "paredes" });
    const wall_7 = this.matter.add.rectangle(730, 2030, 10, 50, { isStatic: true, label: "paredes" });
    const wall_8 = this.matter.add.rectangle(850, 2030, 10, 50, { isStatic: true, label: "paredes" });
    const wall_9 = this.matter.add.rectangle(1020, 2030, 10, 70, { isStatic: true, label: "paredes" });
    const wall_10 = this.matter.add.rectangle(1095, 2030, 10, 70, { isStatic: true, label: "paredes" });
    const wall_11 = this.matter.add.rectangle(1835, 2560, 10, 70, { isStatic: true, label: "paredes" });
    const wall_12 = this.matter.add.rectangle(1355, 950, 10, 120, { isStatic: true, label: "paredes" });
    const wall_13 = this.matter.add.rectangle(1045, 950, 10, 120, { isStatic: true, label: "paredes" });
    const wall_14 = this.matter.add.rectangle(1830, 480, 10, 100, { isStatic: true, label: "paredes" });
    
    createWall(this, wallCollisionLeft);
    createWall(this, wallCollisionRight);
    createWall(this, wall_1);
    createWall(this, wall_2);
    createWall(this, wall_3);
    createWall(this, wall_4);
    createWall(this, wall_5);
    createWall(this, wall_6);
    createWall(this, wall_7);
    createWall(this, wall_8);
    createWall(this, wall_9);
    createWall(this, wall_10);
    createWall(this, wall_11);
    createWall(this, wall_12);
    createWall(this, wall_13);
    createWall(this, wall_14);

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");

    this.archer = new Archer2(1,
      this,
      { x: 500, y: 400 },
      "archer2",
      "archer2_idle-0.png",
      "archer2_physics",
      3,
      2,
      "arrow",
      48,
      30)
    this.necro = new Necromancer(
      1,
      this,
      { x: 400, y: 400 },
      "necromancer",
      "necromancer_idle-0.png",
      "necromancer_physics",
      3,
      2,
      "projectile",
      48,
      30
    );
    this.archer.controller = new EnemyController(
      this,
      this.archer,
      this.player
    );

    this.necro.controller = new EnemyController(
      this,
      this.necro,
      this.player
    );
   // this.archer.controller.setState("projectileAttack");
    this.necro.controller.setState("projectileAttack");
    this.player = new Knight(this, this.player_spawn, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);
    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");

    this.archer = new Archer2(1, this, { x: 400, y: 400 }, "archer2", "archer2_idle-0.png", "archer2_physics", 3, 2, "arrow", 48, 30);
    this.archer.controller = new EnemyController(this, this.archer, this.player);
    this.archer.controller.setState("idle");
    
    this.camera.startFollow(this.player, true, 0.08, 0.08, 80);
  }

  update() {
    super.update(this);

    // this.archer.updateHealthBar();
    // this.archer.controller.update();
    //  this.necro.controller.update();

    // const distance = Phaser.Math.Distance.Between(
    //   this.player.x,
    //   this.player.y,
    //   this.necro.x,
    //   this.necro.y
    // );
    // if((distance > 70 && distance < 600) && !this.necro.isAttackAnimationDone) {
    //   this.necro.controller.setState("projectileAttack");
    // } else if (distance <= 70 && !this.necro.isAttackAnimationDone){
    //   this.necro.controller.setState("spawn");
    // }
    
    // else if(this.necro.isAttackAnimationDone) {
    //   this.necro.controller.setState("followPlayer");

    //   if(distance < 600) {
    //     this.necro.isAttackAnimationDone = false;
    //   }
    // }
  }
}

export default Map2;
