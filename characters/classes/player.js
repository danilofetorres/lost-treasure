import Character from "./character.js";

class Player extends Character {
  health_bar;
  heart_group;
  is_colliding_with_trap;
  is_climbing_ladder;
  can_jump;
  previous_velocity_y;
  previous_position_y;
  healing_potions = 3;

  constructor(
    scene,
    spawn,
    texture,
    frame,
    shape,
    max_health,
    speed,
    height,
    width
  ) {
    super(
      scene,
      spawn,
      texture,
      frame,
      shape,
      max_health,
      speed,
      height,
      width
    );

    this.is_colliding_with_trap = false;
    this.is_climbing_ladder = false;
    this.previous_velocity_y = 0;
    this.previous_position_y = this.y;

    this.health_bar = scene.add.graphics();
    this.health_bar.fillStyle(0xede6e6, 1);
    this.health_bar.fillRoundedRect(13, 15, 305, 45, 10);
    this.health_bar.setScrollFactor(0);
    this.heart_group = scene.add.group();

    const spacing = 29;
    const start_y = 26;

    for (let i = 0; i < this.hearts; i++) {
      const heart_x = 22 + spacing * i;
      const heart_y = start_y;

      const heart = scene.add
        .sprite(heart_x, heart_y, "heart", "heart_deplete-0.png")
        .setOrigin(0, 0)
        .setScale(1.5);

      this.heart_group.add(heart);
    }

    this.heart_group.children.iterate((heart) => {
      heart.setScrollFactor(0);
    });
  }

  climb(direction) {
    this.setVelocityY(0);

    if (direction === "up") {
      this.y -= 1;
    } else if (direction === "down") {
      this.y += 2;
    }
  }

  jump(scene) {
    this.scene.matter.world.once("collisionactive", (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        if (
          (bodyA.label === `${this.texture.key}` ||
            bodyB.label === `${this.texture.key}`) &&
          (bodyA.gameObject?.tile?.layer.name ===
            scene.block_layer.layer.name ||
            bodyB.gameObject?.tile?.layer.name ===
              scene.block_layer.layer.name ||
            bodyA.gameObject?.tile?.layer.name ===
              scene.barrel_layer.layer.name ||
            bodyB.gameObject?.tile?.layer.name ===
              scene.barrel_layer.layer.name ||
            bodyA.gameObject?.tile?.layer.name ===
              scene.trap_layer.layer.name ||
            bodyB.gameObject?.tile?.layer.name ===
              scene.trap_layer.layer.name ||
            bodyA.gameObject?.tile?.layer.name === "bloco_removivel" ||
            bodyB.gameObject?.tile?.layer.name === "bloco_removivel")
        ) {
          this.previous_position_y = this.y;
          this.setVelocityY(-8);
        }
      });
    });

    this.is_climbing_ladder = false;
  }

  updateHealth() {
    this.heart_group.children.iterate((heart, index) => {
      if (index < Math.floor(this.hearts)) {
        heart.setFrame("heart_deplete-0.png");
      } else if (
        index === Math.floor(this.hearts) &&
        this.hearts !== Math.floor(this.hearts)
      ) {
        heart.play("heart_deplete_first_half");
      } else {
        if (heart.frame.name === "heart_deplete-0.png") {
          heart.play("heart_deplete");
        } else if (heart.frame.name === "heart_deplete-2.png") {
          heart.play("heart_deplete_second_half");
        }
      }
    });
  }

  trapCollider(event, scene) {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair;

      if (
        (bodyA.label === `${this.texture.key}` ||
          bodyB.label === `${this.texture.key}`) &&
        (bodyA.gameObject?.tile?.layer.name === scene.trap_layer.layer.name ||
          bodyB.gameObject?.tile?.layer.name === scene.trap_layer.layer.name)
      ) {
        if (!this.is_colliding_with_trap) {
          this.getHit(0.5);
          this.is_colliding_with_trap = true;
        }

        setTimeout(() => {
          this.is_colliding_with_trap = false;
        }, "1000");
      }
    });
  }

  fallDamageHandlerUpdate(scene) {
    const current_velocity_y = this.body.velocity.y;
    const fallDistance = this.previous_velocity_y - current_velocity_y;

    if (fallDistance > 9.2 && this.y > this.previous_position_y) {
      this.getHit(Math.floor(fallDistance ** 2 / 2.5 / 10) / 2);
    }

    this.is_climbing_ladder = false;
    this.previous_velocity_y = current_velocity_y;
  }
}

export default Player;
