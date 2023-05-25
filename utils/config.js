export function sheet(key, url, width, height, endFrame) {
  return {
    key: key,
    url: url,
    frameConfig: {
      frameWidth: width,
      frameHeight: height,
      startFrame: 0,
      endFrame: endFrame,
    },
  };
}

export function anims(obj, key, character, endFrame) {
  return {
    key: key,
    frames: obj.anims.generateFrameNumbers(character, {
      start: 0,
      end: endFrame,
      first: endFrame,
    }),
    frameRate: 10,
    repeat: -1,
  };
}