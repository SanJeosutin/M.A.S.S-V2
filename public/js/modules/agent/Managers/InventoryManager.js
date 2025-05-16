// InventoryManager.js
import { Inventory } from "../../inventory.js";

export default class InventoryManager {
  constructor(capacity) {
    this._inventory = new Inventory(capacity);
  }

  add(item) {
    return this._inventory.add(item);
  }

  remove(item) {
    const idx = this._inventory.items.indexOf(item);
    if (idx !== -1) {
      this._inventory.removeAt(idx);
      return true;
    }
    return false;
  }

  findIndexByType(type) {
    return this._inventory.findIndexByType(type);
  }

  clear() {
    this._inventory.clear();
  }

  forEach(callback) {
    this._inventory.forEach(callback);
  }

  map(callback) {
    return this._inventory.map(callback);
  }

  get items() {
    return this._inventory.items;
  }

  get length() {
    return this._inventory.length;
  }
}
