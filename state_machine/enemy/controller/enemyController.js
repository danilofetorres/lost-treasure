import AttackState from "../attackState.js";
import FollowPlayerState from "../followPlayerState.js";
import IdleState from "../idleState.js";
import ArrowState from "../ArrowState.js";

class EnemyController {
  states;
  current_state;

  constructor(scene, enemy, player) {
    this.states = {
      idle: new IdleState(enemy),
      followPlayer: new FollowPlayerState(enemy, player),
      attack: new AttackState(scene, enemy),
      arrowAttack: new ArrowState(enemy, scene, player)
    };
  }

  setState(name) {
    if(this.current_state === this.states[name]) {
      return;  
    }

    if(this.current_state) {
      this.current_state.exit();  
    }

    this.current_state = this.states[name];
    
    this.current_state.enter();
  }

  update() {
    this.current_state.onUpdate();
  }
}

export default EnemyController;