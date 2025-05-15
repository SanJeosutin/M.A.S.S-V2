export default class InventoryManager {
    constructor(capacity) {
      this.capacity = capacity;
      this.items    = [];
    }
  
    add(item) {
      if (this.items.length < this.capacity) this.items.push(item);
    }
  
    remove(item) {
      this.items = this.items.filter(i => i !== item);
    }
  }
  