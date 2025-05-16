import { egi } from './utils/graphics.js';
import { Matrix33 } from './utils/matrix33.js';

import Agent from './agent/agent.js';
import { Base } from './base.js';
import { Item, ITEM_DEFINITIONS } from './items.js';

export var ITEM_TYPES = Object.keys(ITEM_DEFINITIONS);

export class World {
  constructor(width, height, context) {
    this.cx = width;
    this.cy = height;
    this.ctx = context;
    egi.initialize(this.ctx);

    this.paused = false;
    this.showInfo = true;
    this.showSight = false;
    this.debugEnabled = false;

    this.agents = [];
    this.items = [];
    this.bases = [];

    this.spawnBases(1);
    this.spawnItems(256);
    this.spawnAgents(4);
  }

  togglePause() {
    this.paused = !this.paused;
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;
  }

  toggleSight() {
    this.showSight = !this.showSight;
  }

  toggleDebug() {
    this.debugEnabled = !this.debugEnabled;
  }

  spawnBases(count) {
    for (var i = 0; i < count; i++) {
      var base = new Base(this);
      this.bases.push(base);

      var startPos = base.position.clone();
      var agent = new Agent(startPos, this, base);

      this.agents.push(agent);
      base.residents.push(agent);
    }
  }

  spawnAgents(count) {
    for (var i = 1; i < count; i++) {
      if (this.bases.length === 0) break;

      var randomIndex = Math.floor(Math.random() * this.bases.length);
      var homeBase = this.bases[randomIndex];
      // start the agent at its home base’s position:
      var startPos = homeBase.position.clone();
      var agent = new Agent(startPos, this, homeBase);
      this.agents.push(agent);
      homeBase.residents.push(agent);
    }
  }

  spawnItems(count, type) {
    for (var i = 0; i < count; i++) {
      var itemType;
      if (type !== undefined && type !== null) {
        itemType = type;
      } else {
        var randomIndex = Math.floor(Math.random() * ITEM_TYPES.length);
        itemType = ITEM_TYPES[randomIndex];
      }
      var names = Object.keys(ITEM_DEFINITIONS[itemType]);
      var nameIndex = Math.floor(Math.random() * names.length);
      var itemName = names[nameIndex];
      var stats = ITEM_DEFINITIONS[itemType][itemName];
      var item = new Item(this, itemType, itemName, stats);
      this.items.push(item);
    }
  }

  update(delta) {
    if (this.paused) {
      return;
    }

    for (var i = 0; i < this.agents.length; i++) {
      this.agents[i].update(delta);
    }
  }

  render() {
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].render();
    }
    for (var i = 0; i < this.bases.length; i++) {
      this.bases[i].render();
    }
    for (var i = 0; i < this.agents.length; i++) {
      this.agents[i].render();
    }

    if (this.showInfo) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('Agents: ' + this.agents.length, 10, 20);
      this.ctx.fillText('Items : ' + this.items.length, 10, 40);
      this.ctx.fillText('Bases : ' + this.bases.length, 10, 60);
    }
  }

  wrapAround(position) {
    if (position.x > this.cx) {
      position.x -= this.cx;
    }
    if (position.x < 0) {
      position.x += this.cx;
    }
    if (position.y > this.cy) {
      position.y -= this.cy;
    }
    if (position.y < 0) {
      position.y += this.cy;
    }
  }

  remove(obj) {
    // if it has a position and came from items array, assume it’s an item
    if (this.items && this.items.includes(obj)) {
      const index = this.items.indexOf(obj);

      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  }

  transformMatrix(position, heading, side) {
    return Matrix33.buildTransform(position, heading, side);
  }
}

