import Action from '../Action.js';

export class UsePersonalItemAction extends Action {
  constructor(agent) {
    super('UsePersonalItem', 1);

    this.agent = agent;
    this.addPrecondition('hasUsefulItem', true);
    this.addEffect('hasUsefulItem', false);
  }

  checkProceduralPrecondition(agent) {
    const item = agent.inventory.items.find(it => it.stats.health > 0 || it.stats.energy > 0);
    if (!item) return false;
    this.target = item;
    return true;
  }

  perform(agent) {
    // if we never got a target from planning/prechecking, grab one now
    if (!this.target) {
      if (!this.checkProceduralPrecondition(agent)) {
        // no usable item? abort this action for now
        return false;
      }
    }

    Object.entries(this.target.stats).forEach(([stat, val]) =>
      agent.stateManager.vars[stat] = Math.min(100, agent.stateManager.vars[stat] + val)
    );
    
    agent.inventory.remove(this.target);
    this.completed = true;
    return true;
  }
}
