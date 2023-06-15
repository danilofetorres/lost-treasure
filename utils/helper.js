function collide(obj_1, obj_2, mult_1, mult_2) {
  return (
    obj_1.x < obj_2.x + obj_2.width &&
    obj_1.x + obj_1.width / (mult_1  * mult_1) > obj_2.x &&
    obj_1.y / mult_2 < obj_2.y + obj_2.height &&
    obj_1.y + obj_1.height / mult_1 > obj_2.y
  );
}

export default collide;