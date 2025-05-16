import Action from '../Action.js';

export class CollectItemAction extends Action {
  constructor() {
    super('CollectItem', 2);
    this.addEffect('hasUsefulItem', true);
    this.reset();
  }

  checkProceduralPrecondition(agent) {
    // find the nearest useful item in the world
    let closest = null;
    let closestDist = Infinity;
    for (const item of agent.world.items) {
      if (!item.isUseful) continue;
      const d = agent.position.distanceTo(item.position);
      if (d < closestDist) {
        closestDist = d;
        closest = item;
      }
    }
    if (!closest) {
      // no items available right now
      return false;
    }
    // store it for perform()
    this.target = closest;
    return true;
  }

  perform(agent) {
    // — if we don’t yet have a target, try to find one now —
    if (!this.target) {
      if (!this.checkProceduralPrecondition(agent)) {
        console.log('[GOAP][CollectItem] No item found — aborting action');
        this.completed = true;
        return true; // tell the behaviour manager we're done (no-op)
      }
    }
    
    // if we still have energy, move toward the item
    if (!agent.position.equals(this.target.position)) {
      agent.moveToward(this.target.position);
      return false;  // not done until we arrive
    }

    // arrived! pick it up
    agent.inventory.add(this.target);
    agent.world.remove(this.target);
    this.completed = true;
    return true;
  }

  reset() {
    this.completed = false;
    this.target = null;
    this.cost = 1;
  }
}
