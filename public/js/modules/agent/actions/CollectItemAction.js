import Action from '../Action.js';

export class CollectItemAction extends Action {
  constructor(agent) {
    super('CollectItem', 2);

    this.agent = agent;
    // only collect if we currently have no item
    this.addPrecondition('hasUsefulItem', false);
    // after collecting, we will have an item
    this.addEffect('hasUsefulItem', true);

    this.reset();
  }

  checkProceduralPrecondition(agent) {
    console.log(`[CollectItem] Agent ${agent.id} scanning for items within viewRange ${agent.viewRange}`);

    // 1) How many items are in the world, and how many you think are “useful”?
    const totalItems = agent.world.items.length;
    const usefulItems = agent.world.items.filter(it => it.isUseful).length;
    console.log(
      `[CollectItem] world items=${totalItems}, ` +
      `usefulItems=${usefulItems}`
    );

    // 2) Log each useful item’s position and distance:
    const inView = agent.world.items.filter(item =>
      agent.position.distance(item.position) <= agent.viewRange
    );

    
    for (const item of agent.world.items) {
      if (!item.isUseful) continue;
      const d = agent.position.distance(item.position);
      console.log(
        ` → Item ${item.type}/${item.name} @ ` +
        `(${item.position.x.toFixed(1)},${item.position.y.toFixed(1)}), ` +
        `dist=${d.toFixed(1)}`
      );
      if (d <= agent.viewRange) {
        inView.push(item);
      }
    }


    console.log(`[CollectItem] Agent ${agent.id} sees ${inView.length} useful item(s) in range`);

    if (inView.length === 0) {
      console.log(`[CollectItem] Agent ${agent.id} found no items → cannot collect`);
      return false;
    }

    // score each item by sum of its stats
    let best = inView[0];
    let bestScore = this._score(best);
    for (const item of inView) {
      const s = this._score(item);
      if (s > bestScore) {
        best = item;
        bestScore = s;
      }
    }

    console.log(
      `[CollectItem] Agent ${agent.id} selected target ${best.type}/${best.name || ''} ` +
      `at (${best.position.x.toFixed(1)},${best.position.y.toFixed(1)}) with score ${bestScore}`
    );

    this.target = best;
    return true;
  }

  perform(agent) {
    console.log(
      `[CollectItem] Agent ${agent.id} performing; ` +
      `current target = ${this.target ? this.target.type + '/' + this.target.name : 'none'}`
    );
    // if we already finished, just return true
    if (this.completed) return true;

    // ensure we have a valid target
    if (!this.target) {
      if (!this.checkProceduralPrecondition(agent)) {
        console.log(`[CollectItem] Agent ${agent.id} aborting—no target`);
        // nothing to pick up → mark done as no-op
        this.isDone();
        return true;
      }
    }

    // move toward the target
    if (!agent.position.equals(this.target.position)) {
      console.log(
        `[CollectItem] Agent ${agent.id} moving toward target at ` +
        `(${this.target.position.x.toFixed(1)},${this.target.position.y.toFixed(1)})`
      );
      agent.moveToward(this.target.position);
      return false;  // still en route
    }

    console.log(
      `[CollectItem] Agent ${agent.id} arrived at target; ` +
      `picking up ${this.target.type}/${this.target.name}`
    );


    const d = agent.position.distance(this.target.position);
    if (d <= agent.pickupRadius) {
      // arrived — pick up!
      agent.inventory.add(this.target);
      agent.world.remove(this.target);
      this.completed = true;
      return true;
    } else {
      // still en route
      agent.moveToward(this.target.position);
      return false;
    }
  }

  reset() {
    this.completed = false;
    this.target = null;

    console.log(`[CollectItem] reset called for Agent ${this.agent.id}`);
  }

  isDone() {
    return this.completed;
  }

  _score(item) {
    return Object.values(item.stats).reduce((sum, v) => sum + v, 0);
  }
}
