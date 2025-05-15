import { Vector2D } from "../../utils/vector2d.js";

export default class FlockBehaviour {
  constructor(agent) {
    this.agent = agent;
    this.viewRange = agent.config.viewRange;
    this.maxViewAngle = Math.PI * 0.75; // ±67.5° forward FOV
    this.weights = { separation: 1.5, alignment: 1.0, cohesion: 1.0 };
  }

  execute(delta) {
    const { agent, viewRange, maxViewAngle } = this;
    const position = agent.position;
    let velocity = agent.velocity.clone();
    if (velocity.length() === 0) velocity = new Vector2D(1, 0);
    const forward = velocity.normalise();

    // dynamic FOV based on health
    const healthFactor = agent.stateManager.vars.health / 100;
    const viewAngle = maxViewAngle * healthFactor;
    const cosView = Math.cos(viewAngle / 2);

    // build group: radius, forward FOV, same home
    const group = agent.world.agents.filter(other => {
      if (other === agent) return false;
      if (other.home !== agent.home) return false;
      const diff = other.position.clone().subtract(position);
      const dist = diff.length();
      if (dist > viewRange) return false;
      if (forward.dot(diff.normalise()) < cosView) return false;
      return true;
    });
    if (!group.length) return;

    // steering components
    const sep = this.separation(group).multiply(this.weights.separation);
    const align = this.alignment(group).multiply(this.weights.alignment);
    const coh = this.cohesion(group).multiply(this.weights.cohesion);
    const steer = sep.add(align).add(coh);

    if (steer.length() > 0) {
      const newVel = steer.normalise();
      agent.velocity.x = newVel.x;
      agent.velocity.y = newVel.y;
    }
  }

  separation(group) {
    const agent = this.agent;
    const force = new Vector2D(0, 0);
    group.forEach(other => {
      const diff = agent.position.clone().subtract(other.position);
      const d = diff.length();
      if (d > 0) force.add(diff.normalise().divide(d));
    });
    return force;
  }

  alignment(group) {
    const sum = group.reduce((acc, other) => acc.add(other.velocity), new Vector2D(0, 0));
    return sum.divide(group.length).normalise();
  }

  cohesion(group) {
    const center = group.reduce((acc, other) => acc.add(other.position), new Vector2D(0, 0))
      .divide(group.length);
    return center.subtract(this.agent.position).normalise();
  }
}
