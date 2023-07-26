import { createWall, setCollision, createLayer } from "../utils/config.js";

import Map from "./classes/map.js";
import Knight from "../characters/knight.js";
import Archer2 from "../characters/archer2.js";
import PlayerController from "../state_machine/player/controller/playerController.js";
import EnemyController from "../state_machine/enemy/controller/enemyController.js";
import Necromancer from "../characters/necromancer.js";
import Warrior from "../characters/warrior.js";
import Archer from "../characters/archer.js";

var cKeyPressed = false;
class Map2 extends Map {
  player;
  player_spawn;
  player_controller;
  enemies;
  projectiles;
  bloco_removivel_layer;
  archer;
  necro_killed = false;
  potion;
  potion_group;

  constructor() {
    super("map2", "map2");
  }

  init() {
    super.init();
  
    this.enemies = [];
    this.projectiles = [];
  }

  preload() {
    this.camera.fadeIn(1000, 0, 0, 0);

    super.preload();

    this.load.atlas("knight", "assets/character/knight/atlas/knight.png", "assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "assets/character/knight/physics/knight.json");

    this.load.atlas("archer2", "assets/character/archer_2/atlas/archer.png", "assets/character/archer_2/atlas/archer.json");
    this.load.json("archer2_physics", "assets/character/archer_2/physics/archer2.json");
    
    this.load.atlas("necromancer", "assets/character/necromancer/atlas/necromancer.png", "assets/character/necromancer/atlas/necromancer.json");
    this.load.json("necromancer_physics", "assets/character/necromancer/physics/necromancer.json");

    this.load.image("projectile", "assets/character/necromancer/Attack/necromancer_projectile.png");

    this.load.atlas("knight", "assets/character/knight/atlas/knight.png", "assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "assets/character/knight/physics/knight.json");
    
    this.load.atlas("archer2", "assets/character/archer_2/atlas/archer.png", "assets/character/archer_2/atlas/archer.json");
    this.load.json("archer2_physics", "assets/character/archer_2/physics/archer2.json");

    this.load.image("potion", "assets/icons/potion.png");
  }

  create() {
    this.scale.resize(1280, 528);

    this.camera.fadeIn(1000, 0, 0, 0); 

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

    this.potion = this.add.graphics();
    this.potion.fillStyle(0xede6e6, 1);
    this.potion.fillRoundedRect(13, 70, 240, 80, 10);
    this.potion.setScrollFactor(0);
    this.potion_group = this.add.group();

    for (let i = 0; i < 3; i++) {
      const potion_x = 20 + 80 * i;

      const potion = this.add
        .image(potion_x, 80, "potion")
        .setOrigin(0, 0)
        .setScale(2);

      this.potion_group.add(potion);
    }
    this.potion_group.children.iterate((potion) => {
      potion.setScrollFactor(0);
    });

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");

    this.player = new Knight(this, this.player_spawn, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");
    
    this.camera.startFollow(this.player, true, 0.08, 0.08, 80);

    const necromancer_spawn = this.map.findObject("necromancer_spawn", (obj) => obj.name === "necromancer_spawn");
    const necromancer = new Necromancer(1, this, necromancer_spawn, "necromancer", "necromancer_idle-0.png", "necromancer_physics", 15, 2, "projectile", 48, 30);

    this.enemies.push(necromancer);

    let enemy_id = 0;

    for(let i=1; i<=8; i++){
      const spawn = this.map.findObject("archer2_spawn", (obj) => obj.name === `spawn_${i}`);
      const archer2 = new Archer2(enemy_id++, this, spawn, "archer2", "archer2_idle-0.png", "archer2_physics", 3, 2, "arrow", 48, 30);

      this.enemies.push(archer2);
    }

    for(let i=1; i<=2; i++) {
      const spawn = this.map.findObject("archer_spawn", (obj) => obj.name === `spawn_${i}`);
      const archer = new Archer(enemy_id++, this, spawn, "archer", "archer_idle-0.png", "archer_physics", 3, 1.5, "arrow", 48, 30);

      this.enemies.push(archer);
    }

    for(let i=4; i<=22; i++) {
      const spawn = this.map.findObject("warrior_spawn", (obj) => obj.name === `spawn_${i}`);
      const warrior = new Warrior(enemy_id++, this, spawn, "warrior", "warrior_idle-0.png", "warrior_physics", 3, 1.5, 48, 30);

      this.enemies.push(warrior);
    }

    for(const enemy of this.enemies) {
      enemy.controller = new EnemyController(this, enemy, this.player);
      enemy.controller.setState("idle");
    }

    // Traps collision
    this.matter.world.on("collisionstart", (event) => {
      this.player.trapCollider(event, this);

      for(const enemy of this.enemies) {
        enemy.trapCollider(event, this);
      }
    });  

    this.input.keyboard.on('keydown-C',  (event) => {
      
      if(!cKeyPressed && this.player.healing_potions > 0) {
        cKeyPressed = true;
        this.player.healing_potions--;
        this.player.hearts = 10;
        this.player.updateHealth();
        this.updatePotion();
      }
    });

  }

  update() {
    super.update(this);
     if(this.necro_killed){
      console.log("necro killed")
      this.camera.fadeOut(400, 0, 0, 0);
    
      this.camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
        this.scene.start("treasure_room", {x: this.player.x, y: this.player.y});
      });
      this.necro_killed =  false;
    }
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

  updatePotion(){
    this.potion.clear();
    this.potion_group.clear(true, true);
    if(this.player.healing_potions > 0){
      this.potion.fillStyle(0xede6e6, 1);
      this.potion.fillRoundedRect(13, 70, 80 * this.player.healing_potions, 80, 10);
      this.potion.setScrollFactor(0);
  
      for (let i = 0; i < this.player.healing_potions; i++) {
        const potion_x = 20 + 80 * i;
  
        const potion = this.add
          .image(potion_x, 80, "potion")
          .setOrigin(0, 0)
          .setScale(2);
  
        this.potion_group.add(potion);
      }
      this.potion_group.children.iterate((potion) => {
        potion.setScrollFactor(0);
      });
    }
    
  }
}
function resetCKey() {
  cKeyPressed = false;
}
document.addEventListener('keyup', resetCKey);

export default Map2;
