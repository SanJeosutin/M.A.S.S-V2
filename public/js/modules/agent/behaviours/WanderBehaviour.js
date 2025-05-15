import { Vector2D } from "../../utils/vector2d.js";

export default class WanderBehaviour {
  constructor(agent) {
    this.agent = agent;
    this.wanderAngle = 0;
  }

  execute(delta) {
    const circleRadius = 5;
    const circleDistance = 20;
    const angleChange = 0.3;

    this.wanderAngle += (Math.random() * 2 - 1) * angleChange;

    const circleCenter = this.agent.velocity.clone().normalise().multiply(circleDistance);
    const displacement = new Vector2D(
      Math.cos(this.wanderAngle) * circleRadius,
      Math.sin(this.wanderAngle) * circleRadius
    );

    const wanderForce = circleCenter.add(displacement);
    const newVel = wanderForce.normalise();
    this.agent.velocity.x = newVel.x;
    this.agent.velocity.y = newVel.y;
  }
}
