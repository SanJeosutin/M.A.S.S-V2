export class Inventory {
    constructor(capacity) {
        this.capacity = capacity;
        this.items = [];
    }

    add(item) {
        if (this.items.length < this.capacity) {
            this.items.push(item);
            return true;
        }
        return false;
    }

    removeAt(index) {
        if (index >= 0 && index < this.items.length) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    findIndexByType(type) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].type === type) {
                return i;
            }
        }
        return -1;
    }

    clear() {
        this.items = [];
    }

    forEach(callback) {
        for (var i = 0; i < this.items.length; i++) {
            callback(this.items[i], i);
        }
    }

    get length() {
        return this.items.length;
    }

    map(callback) {
        return this.items.map(callback);
    }
}