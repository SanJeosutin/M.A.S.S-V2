import Action from '../Action.js';

export class ReturnItemAction extends Action {
  constructor() {
    super('ReturnItem', 1);
    // only do this if agent is carrying something
    this.addPrecondition('hasUsefulItem', true);
    // dropped it at base
    this.addEffect('hasUsefulItem', false);
  }

  checkProceduralPrecondition(agent) {
    if (agent.inventory.items.length === 0) return false;
    // if at the base, skip
    const distToBase = agent.position.distance(agent.home.position);
    if (distToBase < agent.radius + 2) return false;
    this.target = agent.home.position;
    return true;
  }

  perform(agent) {
    // navigate toward base
    const toBase = this.target.subtract(agent.position).normalise();
    agent.velocity.x = toBase.x * agent.config.baseSpeed;
    agent.velocity.y = toBase.y * agent.config.baseSpeed;

    // once arrive: deposit
    const dist = agent.position.distance(this.target);
    if (dist <= agent.radius + 2) {
      const item = agent.inventory.items[0];
      agent.home.inventory.push(item);
      agent.inventory.remove(item);
      agent.velocity.zero();
      this.completed = true;
    }
    return true;
  }
}
