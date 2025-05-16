export default class Action {
    constructor(name, cost = 1) {
      this.name          = name;
      this.cost          = cost;
      this.preconditions = {};
      this.effects       = {};
      this.completed     = false;
      this.target        = null;
    }
  
    addPrecondition(key, value) { this.preconditions[key] = value; }
    addEffect(key, value)       { this.effects[key]       = value; }
  
    reset()      { this.completed = false; this.target = null; }
    isDone()     { return this.completed; }
    meetsPreconditions(state) {
      return Object.entries(this.preconditions)
        .every(([k,v]) => state[k] === v);
    }
  
    // override in subclass
    checkProceduralPrecondition(agent) { return true; }
    perform(agent) {
      this.completed = true;
      return true;
    }
  }
  