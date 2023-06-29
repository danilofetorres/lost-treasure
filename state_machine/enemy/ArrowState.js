import Arrow from "../../characters/arrow.js";

class ArrowState {
    enemy;
    scene;
    player;


    constructor(enemy, scene, player) {
        this.enemy = enemy;
        this.scene = scene;
        this.player = player;
    }

    enter() {
        this.enemy.play(`${this.enemy.texture.key}_attack_${this.enemy.id}`);
    }

    onUpdate() {
        const startHit = (anim, frame) => {
                if (frame.index == this.enemy.arrowData.frame) {
                    if(this.enemy.can_hit){
                        var arrow = new Arrow(this.scene, this.enemy.flipX ? this.enemy.x - this.enemy.arrowData.x : this.enemy.x + this.enemy.arrowData.x, this.enemy.y - this.enemy.arrowData.y, this.enemy.arrow, null, this.enemy.physics, this.enemy.flipX, {archerX: this.enemy.x, archerY: this.enemy.y, playerX: this.player.x, playerY: this.player.y});
                        this.scene.arrows.push(arrow);
                    }

                    this.enemy.can_hit = false;
                }
            

            this.enemy.off(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);
        };

        this.enemy.on(Phaser.Animations.Events.ANIMATION_UPDATE, startHit);

        this.enemy.on("animationrepeat", () => {
            if (this.enemy.controller.current_state === this.enemy.controller.states["arrow_attack"]) {
                this.enemy.isAttackAnimationDone = true;
                this.enemy.can_hit = true;  
                this.exit();
            }
        });
    }

    exit() {
        this.enemy.stop();
    }
}

export default ArrowState;