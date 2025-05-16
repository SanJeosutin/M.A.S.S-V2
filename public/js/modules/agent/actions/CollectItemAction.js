import Action from '../Action.js';

export class CollectItemAction extends Action {
  constructor() {
    super('CollectUsefulItem', 2);
    this.addEffect('hasUsefulItem', true);
  }

  checkProceduralPrecondition(agent) {
    const items = agent.world.items.filter(i => i.value > 10);
    if (!items.length) return false;
    // pick nearest
    this.target = items.reduce((a,b) =>
      agent.position.distance(b.position) < agent.position.distance(a.position) ? b : a
    );
    return true;
  }

  perform(agent) {
    const dist = agent.position.distance(this.target.position);
    if (dist > agent.radius + 1) {
      const dir = this.target.position.subtract(agent.position).normalise();
      agent.velocity.x = dir.x;
      agent.velocity.y = dir.y;
      return false;
    }
    agent.inventory.add(this.target);
    agent.world.items = agent.world.items.filter(i => i !== this.target);
    agent.velocity.zero();
    this.completed = true;
    return true;
  }
}
