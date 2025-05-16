export default class MovementManager {
  constructor(agent, baseSpeed) {
    this.agent = agent;
    this.baseSpeed = baseSpeed;
  }

  update(delta) {
    // velocity adjusted by desired behaviour
    this.agent.position.x += this.agent.velocity.x * this.baseSpeed * delta;
    this.agent.position.y += this.agent.velocity.y * this.baseSpeed * delta;

    // collision avoidance: push agents apart if overlapping
    const minDist = this.agent.radius * 2;
    this.agent.world.agents.forEach(other => {
      if (other === this.agent) return;
      const diff = this.agent.position.clone().subtract(other.position);
      const d = diff.length();
      if (d > 0 && d < minDist) {
        const push = diff.normalise().multiply(minDist - d);
        this.agent.position = this.agent.position.add(push);
      }
    });
  }
}
