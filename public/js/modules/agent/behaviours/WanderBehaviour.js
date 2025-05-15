import {Vector2D} from "../../utils/vector2d.js";

export default class WanderBehaviour {
  constructor(agent) {
    this.agent       = agent;
    this.wanderAngle = 0;
  }

  execute(delta) {
    const { agent } = this;
    const circleRadius   = 5;
    const circleDistance = 20;
    const angleChange    = 0.3;

    // random jitter
    this.wanderAngle += (Math.random() * 2 - 1) * angleChange;

    // project a circle in front of agent
    const circleCenter = agent.velocity.clone().normalize().multiply(circleDistance);
    const displacement = new Vector2D(
      Math.cos(this.wanderAngle) * circleRadius,
      Math.sin(this.wanderAngle) * circleRadius
    );

    const wanderForce = circleCenter.add(displacement);
    const newVel      = wanderForce.normalize();
    agent.velocity.x  = newVel.x;
    agent.velocity.y  = newVel.y;
  }
}
