export function createLayer(scene, key) {
  return scene.map.createLayer(key, scene.blocks, 0, 0);
}

export function createAnim(scene, key, character, endFrame) {
  scene.anims.create({
    key: `${character}_${key}`,
    frameRate: 10,
    frames: scene.anims.generateFrameNames(character, {
      prefix: `${character}_${key}-`,
      suffix: ".png",
      start: 0,
      end: endFrame,
      zeroPad: 1,
    }),
    repeat: 0,
  });
}

export function setCollision(scene, layer) {
  layer.setCollisionByProperty({ collides: true });
  scene.matter.world.convertTilemapLayer(layer);
}
