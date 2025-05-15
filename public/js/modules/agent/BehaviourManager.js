import Wanderbehaviour from "./behaviours/WanderBehaviour.js";
import Flockbehaviour from "./behaviours/FlockBehaviour.js";

export default class behaviourManager {
  constructor(agent) {
    this.agent = agent;
    this.behaviours = [
      new Wanderbehaviour(agent),
      new Flockbehaviour(agent)
    ];
  }

  update(delta) {
    this.behaviours.forEach(b => b.execute(delta));
  }
}
