export default class MovementManager {
  constructor(agent, speed) {
    this.agent = agent;
    this.speed = speed;
  }

  update(delta) {
    let vars = this.agent.stateManager.vars;

    // exhaustion
    if (vars.energy === 0 && !this.agent.stateManager.isExhausted) {
      this.agent.stateManager.isExhausted = true;
      console.log(`Agent ${this.agent.id} is now exhausted: speed halved and health draining`);
    }

    const speedFactor = this.agent.stateManager.isExhausted ? 0.15 : 1.0;

    // integrate movement
    this.agent.position.x += this.agent.velocity.x * this.speed * speedFactor * delta;
    this.agent.position.y += this.agent.velocity.y * this.speed * speedFactor * delta;

    // collision avoidance
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
