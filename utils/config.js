export function createLayer(scene, key) {
  return scene.map.createLayer(key, scene.blocks, 0, 0);
}

export function createAnim(scene, id=null, key, character, endFrame, frameRate=10) {
  scene.anims.create({
    key: id !== null ? `${character}_${key}_${id}` : `${character}_${key}`,
    frameRate: frameRate,
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
