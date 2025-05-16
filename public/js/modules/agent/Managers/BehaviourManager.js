import WanderBehaviour from "../behaviours/WanderBehaviour.js";
//import Flockbehaviour from "./behaviours/FlockBehaviour.js";

import { GOAPPlanner, CollectItemAction, UsePersonalItemAction, UseBaseItemAction, HelpTeammateAction } from "../goap.js";

export default class behaviourManager {
  constructor(agent) {
    this.agent = agent;
    this.wander = new WanderBehaviour(agent);

    this.planner = new GOAPPlanner();
    this.availableActions = [
      new CollectItemAction(),
      new UsePersonalItemAction(),
      new UseBaseItemAction(),
      new HelpTeammateAction()
    ];

    this.currentPlan = [];
    this.currentAction = null;
  }

  update(delta) {
    //this.behaviours.forEach(b => b.execute(delta));

    // If no action or current is done, plan or wander
    if (!this.currentAction || this.currentAction.isDone()) {
      // Build a new plan if needed
      if (this.currentPlan.length === 0) {
        const ws = {
          hasUsefulItem: this.agent.inventory.items.length > 0,
          needsHealth: this.agent.stateManager.vars.health < 50,
          teammateInNeed: this.agent.home.residents.some(
            a => a !== this.agent && a.stateManager.vars.health < 50 && !a.isDead
          )
        };
        const goal = {
          hasUsefulItem: false,
          needsHealth: false,
          teammateInNeed: false
        };
        this.currentPlan = this.planner.plan(
          this.agent,
          this.availableActions,
          ws,
          goal
        );
      }
      // Start next action if available
      if (this.currentPlan.length > 0) {
        this.currentAction = this.currentPlan.shift();
        this.currentAction.reset();
      } else {
        // No plan: wander around
        this.wander.execute(delta);
        return;
      }
    }
    // Execute current GOAP action
    if (this.currentAction) {
      this.currentAction.perform(this.agent);
    }
  }
}
