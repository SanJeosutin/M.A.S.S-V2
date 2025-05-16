import Action from '../Action.js';

export class HelpTeammateAction extends Action {
  constructor(agent) {
    super('HelpTeammate', 2);

    this.agent = agent;
    this.addPrecondition('teammateInNeed', true);
    this.addEffect('teammateInNeed', false);
  }

  checkProceduralPrecondition(agent) {
    const mate = agent.home.residents
      .find(a => a !== agent && a.stateManager.vars.health < 50 && !a.isDead);
    if (!mate) return false;
    const item = agent.inventory.items.find(it => it.stats.health > 0);
    if (!item) return false;
    this.target = { mate, item };
    return true;
  }

  perform(agent) {
    const { mate, item } = this.target;
    mate.stateManager.vars.health = Math.min(100, mate.stateManager.vars.health + item.stats.health);
    agent.inventory.remove(item);
    this.completed = true;
    return true;
  }
}
