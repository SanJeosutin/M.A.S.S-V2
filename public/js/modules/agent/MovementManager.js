export default class MovementManager {
    constructor(agent, baseSpeed) {
      this.agent     = agent;
      this.baseSpeed = baseSpeed;
    }
  
    update(delta) {
      // velocity adjusted by desired behaviour
      this.agent.position.x += this.agent.velocity.x * this.baseSpeed * delta;
      this.agent.position.y += this.agent.velocity.y * this.baseSpeed * delta;
    }
  }
  