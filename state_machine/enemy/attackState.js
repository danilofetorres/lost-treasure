import collide from "../../utils/helper.js";

class AttackState {
  scene;
  enemy;
  player;
  hitboxes;
  
  constructor(scene, enemy) {
    this.scene = scene;
    this.enemy = enemy;  
  }
  
  enter() {
    const rand = Math.floor(Math.random() * 2);

    this.hitboxes = [];

    if(this.enemy.hitboxes[0].constructor === Array) {
      this.hitboxes = this.enemy.hitboxes[rand];
      this.enemy.play(`${this.enemy.texture.key}_attack_${rand}_${this.enemy.id}`);

    } else {
      this.hitboxes = this.enemy.hitboxes;
      this.enemy.play(`${this.enemy.texture.key}_attack_${this.enemy.id}`);
    }

  }
   
  onUpdate() {
    const m1 = 2;
    const m2 = 1.05;
    
    const hit = (index) => {
      this.hitboxes[index].hitbox.x = this.enemy.flipX ? this.enemy.x - 45 : this.enemy.x + 30;
      this.hitboxes[index].hitbox.y = this.enemy.y - 5;
      
      this.hitboxes[index].hitbox.body.enable = true;
      this.scene.physics.world.add(this.hitboxes[index].hitbox.body);
      
      if(collide(this.scene.player, this.hitboxes[index].hitbox, m1, m2)) {

        if(this.hitboxes[index].can_hit) {
          this.scene.player.getHit(1);  
        }
        
        this.hitboxes[index].can_hit = false;
      }
    };
    
    const startHit = (anim, frame) => { 
      this.hitboxes.forEach((hitbox, index) => {
        if(frame.index >= hitbox.frames[0] && frame.index <= hitbox.frames[1]) {
          hit(index);

        } else if(frame.index === hitbox.frames[1]+1) {
          this.enemy.resetHitbox(this.scene);
        } 
      });
      
      this.enemy.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
    };  

    this.enemy.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

    this.enemy.on("animationrepeat", () => {
      if(this.enemy.controller.current_state === this.enemy.controller.states["attack"]) {
        this.enemy.resetHitbox(this.scene);
        this.enemy.isAttackAnimationDone = true;
        this.exit();
      }
    });
  }

  exit() {
    this.enemy.stop();
    this.enemy.off("animationrepeat");
  }
}
  
export default AttackState;
  