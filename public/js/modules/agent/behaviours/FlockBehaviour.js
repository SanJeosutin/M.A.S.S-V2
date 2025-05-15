import {Vector2D} from "../../utils/vector2d.js";

export default class FlockBehaviour {
  constructor(agent) {
    this.agent = agent;
  }

  execute(delta) {
    const agent    = this.agent;
    const neighbors = agent.world.agents.filter(other =>
      other !== agent &&
      other.home === agent.home &&
      agent.position.clone().subtract(other.position).length() < 50
    );
    if (neighbors.length === 0) return;

    // alignment
    const alignSum = neighbors.reduce((sum, other) => sum.add(other.velocity), new Vector2D(0, 0));
    const alignment = alignSum.divide(neighbors.length).normalize();

    // cohesion
    const cohSum = neighbors.reduce((sum, other) => sum.add(other.position), new Vector2D(0, 0));
    const cohesion = cohSum
      .divide(neighbors.length)
      .subtract(agent.position)
      .normalize();

    // separation
    const sepSum = neighbors.reduce((sum, other) => {
      const diff = agent.position.clone().subtract(other.position);
      return sum.add(diff.divide(diff.length() ** 2));
    }, new Vector2D(0, 0));
    const separation = sepSum.normalize();

    // combine with weights
    const steer = alignment.multiply(1.0)
      .add(cohesion.multiply(1.0))
      .add(separation.multiply(1.5));

    if (steer.length() > 0) {
      const newVel = steer.normalize();
      agent.velocity.x = newVel.x;
      agent.velocity.y = newVel.y;
    }
  }
}
