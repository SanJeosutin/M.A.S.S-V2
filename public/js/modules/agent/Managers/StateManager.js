export default class StateManager {
    constructor(initialState, drainRates) {
      this.vars       = { ...initialState };
      this.drainRates = { ...drainRates };
    }
  
    update(delta) {
      for (let key in this.drainRates) {
        this.vars[key] = Math.max(0, this.vars[key] - this.drainRates[key] * delta);
      }
    }
  }
  