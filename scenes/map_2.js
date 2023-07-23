import Map from "./classes/map.js";
import Knight from "../characters/knight.js";
import { createLayer } from "../utils/config.js";
import PlayerController from "../state_machine/player/controller/playerController.js";
import { createWall, setCollision } from "../../utils/config.js";


class Map2 extends Map {
  camera;
  floor;
  player;
  player_spawn;
  player_controller;
  enemies;
  arrows;
  bloco_removivel_layer;

  constructor() {
    super("map2");
  }

  init() {
    super.init();

    this.floor = 0;
    this.camera = this.cameras.main;
  
    this.enemies = [];
    this.arrows = [];
  }

  preload() {
    super.preload();

    // this.load.image('fundo_vermelho', 'assets/tilesets/fundo_vermelho.png');
    // this.load.image('chest(0px)', 'assets/tilesets/chest(0px).png');
    // this.load.image('coins', 'assets/tilesets/image-removebg-preview-removebg-preview.png');

    this.load.atlas("knight", "assets/character/knight/atlas/knight.png", "assets/character/knight/atlas/knight.json");
    this.load.json("knight_physics", "assets/character/knight/physics/knight.json");
  }

  create() {
    super.create();
    createLayer(this, "objetos");
    createLayer(this, "baus");
    this.bloco_removivel_layer = createLayer(this, "bloco_removivel");
    createLayer(this, "moedas")
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



    // const red_background = this.map.addTilesetImage("fundo_vermelho", "fundo_vermelho");
    // const coin = this.map.addTilesetImage("image-removebg-preview-removebg-preview", "coins");
    // const chest = this.map.addTilesetImage("chest(0px)", "chest(0px)");

    // const inner_background = this.map.createStaticLayer("fundo", red_background, 0, 0);
    // const moedas = this.map.createStaticLayer("moedas", coin, 0, 0);
    // const chests = this.map.createStaticLayer("baus", chest, 0, 0);

    // Create characters
    //this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");
    this.player = new Knight(this, {x: 250, y:400}, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");
  }

  update() {
   super.update(this);
  }
}

export default Map2;