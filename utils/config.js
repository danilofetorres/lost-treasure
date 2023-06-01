export function anims(obj, key, character, endFrame) {
  return {
    key: key,
    frameRate: 10,
    frames: obj.anims.generateFrameNames(character, {
      prefix: `${character}_${key}-`,
      suffix: ".png",
      start: 0,
      end: endFrame,
      zeroPad: 1,
    }),
    repeat: -1,
  };
}
