import Action from '../Action.js';

export class UseBaseItemAction extends Action {
  constructor(agent) {
    super('UseBaseItem', 1);
    
    this.agent = agent;
    this.addPrecondition('needsHealth', true);
    this.addEffect('needsHealth', false);
  }

  checkProceduralPrecondition(agent) {
    const idx = agent.home.findItemIndexByStat('health');
    if (idx < 0) return false;
    this.target = agent.home.inventory[idx];
    return true;
  }

  perform(agent) {
    Object.entries(this.target.stats).forEach(([stat,val]) =>
      agent.stateManager.vars[stat] = Math.min(100, agent.stateManager.vars[stat] + val)
    );
    agent.home.inventory.splice(agent.home.inventory.indexOf(this.target), 1);
    this.completed = true;
    return true;
  }
}
