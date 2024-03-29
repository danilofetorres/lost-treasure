import AttackState from "../attackState.js";
import FollowPlayerState from "../followPlayerState.js";
import IdleState from "../idleState.js";
import ProjectileState from "../projectileState.js";
import MeleeState from "../meleeState.js";
import SpawnState from "../spawnState.js";

class EnemyController {
  states;
  current_state;

  constructor(scene, enemy, player) {
    this.states = {
      idle: new IdleState(enemy),
      followPlayer: new FollowPlayerState(enemy, player),
      attack: new AttackState(scene, enemy),
      projectileAttack: new ProjectileState(enemy, scene, player),
      melee: new MeleeState(scene, enemy),
      spawn: new SpawnState(scene, enemy)
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