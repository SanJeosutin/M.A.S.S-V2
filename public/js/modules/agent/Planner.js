// GOAP Planner builds an action sequence from world → goal
export default class GOAPPlanner {
    plan(agent, actions, worldState, goalState) {
      // reset & filter
      const usable = actions.filter(a => { a.reset(); return a.checkProceduralPrecondition(agent); });
      const leaves = [];
      const start  = { parent: null, action: null, state: worldState, cost: 0 };
  
      this._buildGraph(start, leaves, usable, goalState);
  
      if (!leaves.length) {
        console.warn('GOAPPlanner: No plan found');
        return [];
      }
  
      // pick cheapest leaf
      let cheapest = leaves.reduce((a,b) => b.cost < a.cost ? b : a);
      // backtrack
      const plan = [];
      let node = cheapest;
      while (node.action) {
        plan.unshift(node.action);
        node = node.parent;
      }
      return plan;
    }
  
    _buildGraph(parent, leaves, actions, goalState) {
      actions.forEach(action => {
        if (!action.meetsPreconditions(parent.state)) return;
  
        // apply effects
        const newState = { ...parent.state };
        Object.entries(action.effects).forEach(([k,v]) => newState[k] = v);
  
        const node = {
          parent,
          action,
          state: newState,
          cost: parent.cost + action.cost
        };
  
        // goal check
        const solved = Object.entries(goalState)
          .every(([k,v]) => newState[k] === v);
  
        if (solved) {
          leaves.push(node);
        } else {
          const remaining = actions.filter(a => a !== action);
          this._buildGraph(node, leaves, remaining, goalState);
        }
      });
    }
  }
  