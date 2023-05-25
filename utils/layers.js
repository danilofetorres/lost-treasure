export function generateCommonLayers(obj, blocks) {
  const stairs_tiles = obj.map.addTilesetImage("ladder(7px)", "escada");
  const barrel_tile = obj.map.addTilesetImage("barrel(1px)", "barril");
  const opened_door_tile = obj.map.addTilesetImage("door_2(14px)", "door_2(14px)");
  const torch_tile = obj.map.addTilesetImage("torch(7px)", "torch(7px)");
  const ladder_middle_tile = obj.map.addTilesetImage("ladder_middle(0px)", "ladder_middle(0px)");
  const window_tile = obj.map.addTilesetImage("window(19px)", "window(19px)");

  const opened_door = obj.map.createStaticLayer("porta_aberta", opened_door_tile, 0, 0);
  const stairs = obj.map.createStaticLayer("escadas", stairs_tiles, 0, 0);
  const barrels = obj.map.createStaticLayer("barris", barrel_tile, 0, 0);
  const blocklayer = obj.map.createStaticLayer("blocklayer", blocks, 0, 0);
  const torchs = obj.map.createStaticLayer("tochas", torch_tile, 0, 0);
  const middle_ladder = obj.map.createStaticLayer("escada_meio", ladder_middle_tile, 0, 0);
  const windows = obj.map.createStaticLayer("janelas", window_tile, 0, 0);
}