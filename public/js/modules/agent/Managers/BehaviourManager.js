import WanderBehaviour from "../behaviours/WanderBehaviour.js";
//import Flockbehaviour from "./behaviours/FlockBehaviour.js";

import { GOAPPlanner, CollectItemAction, UsePersonalItemAction, UseBaseItemAction, HelpTeammateAction, ReturnItemAction } from "../goap.js";

export default class behaviourManager {
  constructor(agent) {
    this.agent = agent;
    this.wander = new WanderBehaviour(agent);

    this.planner = new GOAPPlanner();
    this.availableActions = [
      new CollectItemAction(this.agent),
      new UsePersonalItemAction(this.agent),
      new UseBaseItemAction(this.agent),
      new HelpTeammateAction(this.agent),
      new ReturnItemAction(this.agent),
    ];

    this.currentPlan = [];
    this.currentAction = null;
  }

  update(delta) {
    // If no action or current is done, plan or wander
    if (!this.currentAction || this.currentAction.isDone()) {
      // clear every action back to its original state
      this.availableActions.forEach(a => a.reset());

      // Build a new plan if needed
      if (this.currentPlan.length === 0) {
        const ws = {
          hasUsefulItem: this.agent.inventory.items.length > 0,
          needsHealth: this.agent.stateManager.vars.health < 50,
          teammateInNeed: this.agent.home.residents.some(
            a => a !== this.agent && a.stateManager.vars.health < 50 && !a.isDead
          )
        };

        // pick exactly one “unsatisfied” goal
        let goal = {};

        // 1) if we’re low on health, fix that first:
        if (ws.needsHealth) {
          goal = { needsHealth: false };

          // 2) else if a teammate’s down, help them:
        } else if (ws.teammateInNeed) {
          goal = { teammateInNeed: false };

          // 3) else if we don’t have loot yet, go collect:
        } else if (!ws.hasUsefulItem) {
          goal = { hasUsefulItem: true };

          // 4) else we’ve got loot, so return it to base:
        } else {
          goal = { hasUsefulItem: false };
        }

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

    // Execute current GOAP action (and mark it done if it succeeded)
    if (this.currentAction) {
      const succeeded = this.currentAction.perform(this.agent);
      if (succeeded) {
        this.currentAction.isDone = true;
        this.currentAction = null;    // so on next tick we re-plan
      }
    }
    // only wander when you have absolutely no GOAP action running
    this.wander.execute(delta);
  }
}
