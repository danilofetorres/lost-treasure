import collide from "../../utils/helper.js";

class AttackState {
  player;
  scene;

  constructor(scene, player) {
    this.player = player;
    this.scene = scene;
  }

  enter() {
    this.player.play(`${this.player.texture.key}_attack`);
  }

  onUpdate() {
    const m1 = 2;
    const m2 = 1.05;

    const hit = (index) => {
      this.player.hitboxes[index].hitbox.x = this.player.flipX ? this.player.x - 35 : this.player.x + 30;
      this.player.hitboxes[index].hitbox.y = this.player.y - 5;    

      this.player.hitboxes[index].hitbox.body.enable = true;

      this.scene.physics.world.add(this.player.hitboxes[index].hitbox.body);
        
      for(let i=0; i<this.scene.enemies.length; i++) {
        const enemy = this.scene.enemies[i];

        if(collide(enemy, this.player.hitboxes[index].hitbox, m1, m2)) {
          if(this.player.hitboxes[index].can_hit) {
            enemy.getHit(`${enemy.texture.key}_get_hit_${enemy.id}`);
              
            if(enemy.hearts <= 0) {
              enemy.die(`${enemy.texture.key}_death_${enemy.id}`, () => {
                enemy.resetHitbox(this.scene);
                enemy.destroy();
              });

              this.scene.enemies.splice(i, 1);
            }
          }
  
          this.player.hitboxes[index].can_hit = false;
        }
      }
    };

    const startHit = (anim, frame) => {
      if(this.scene.enemies) {
  
        this.player.hitboxes.forEach((hitbox, index) => {
          if(frame.index >= hitbox.frames[0]  && frame.index <= hitbox.frames[1]) {
            hit(index);
          }  
        });
      }
  
      this.player.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };

    this.player.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.player.on("animationrepeat", () => {
      this.player.resetHitbox(this.scene);
    });
  }

  exit() {
    this.player.stop();
    this.player.off("animationrepeat");
    this.player.resetHitbox(this.scene);
  }
}

export default AttackState;  
