import AttackState from "../attackState.js";
import DieState from "../dieState.js";
import IdleState from "../idleState.js";
import MoveLeftState from "../moveLeftState.js";
import MoveRightState from "../moveRightState.js";

class PlayerController {
  states;
  current_state;

  constructor(scene, player) {
    this.states = {
      idle: new IdleState(player),
      moveLeft: new MoveLeftState(player),
      moveRight: new MoveRightState(player), 
      attack: new AttackState(scene, player),
      die: new DieState(scene, player),
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

export default PlayerController;