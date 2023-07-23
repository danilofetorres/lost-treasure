import Map from "./classes/map.js";
import Knight from "../characters/knight.js";

class Map2 extends Map {
  constructor() {
    super("map2");
  }

  Init() {}

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

    // const red_background = this.map.addTilesetImage("fundo_vermelho", "fundo_vermelho");
    // const coin = this.map.addTilesetImage("image-removebg-preview-removebg-preview", "coins");
    // const chest = this.map.addTilesetImage("chest(0px)", "chest(0px)");

    // const inner_background = this.map.createStaticLayer("fundo", red_background, 0, 0);
    // const moedas = this.map.createStaticLayer("moedas", coin, 0, 0);
    // const chests = this.map.createStaticLayer("baus", chest, 0, 0);

    // Create characters
    this.player_spawn = this.map.findObject("player_spawn", (obj) => obj.name === "player_spawn");
    this.player = new Knight(this, this.player_spawn, "knight", "knight_idle-0.png", "knight_physics", 10, 3.5, 48, 30);

    this.player_controller = new PlayerController(this, this.player);
    this.player_controller.setState("idle");
  }

  update() {
   super.update(this);
  }
}

export default Map2;