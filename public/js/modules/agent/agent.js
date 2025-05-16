import { Vector2D } from "../utils/vector2d.js";

import MovementManager from "./Managers/MovementManager.js";
import RenderManager from "./Managers/RenderManager.js";
import StateManager from "./Managers/StateManager.js";
import behaviourManager from "./Managers/BehaviourManager.js";
import InventoryManager from "./Managers/InventoryManager.js";

export default class Agent {
  static nextId = 1;

  static stats = {
    energy: 100,
    health: 100,
    hunger: 100,
    thirst: 100,
  }

  static defaultConfig = {
    drainRates: { energy: 0.01, hunger: 1.0, thirst: 1.5 },
    inventoryCapacity: 5,
    shape: 'triangle',
    speed: 50,
    viewRange: 50,
    radius: 8,
  };

  constructor(position, world, home, config = {}, stats = {}) {
    this.id = Agent.nextId++;

    this.world = world;
    this.home = home;
    this.color = home.color;
    this.config = { ...Agent.defaultConfig, ...config };
    this.stats = { ...Agent.stats, ...stats };

    // State, Inventory, Movement, behaviour, Rendering
    this.position = position.clone();
    this.velocity = new Vector2D(0, 0);
    this.viewRange = this.config.viewRange;
    this.radius = this.config.radius;

    this.inventory = new InventoryManager(this.config.inventoryCapacity);

    this.stateManager = new StateManager(this.stats, this.config.drainRates);
    this.movementManager = new MovementManager(this, this.config.speed);
    this.behaviourManager = new behaviourManager(this);
    this.renderManager = new RenderManager(this, this.world.ctx, this.config.shape);

    this.isDead = false;
    this.isExhaused = false;
  }

  update(delta) {
    this.stateManager.update(delta);
    this.behaviourManager.update(delta);
    this.movementManager.update(delta);

    this.wrapWorld();

    // check death
    if (this.stateManager.vars.health <= 0) {
      this.isDead = true;
    }
  }

  render() {
    this.renderManager.draw(
      this.position,
      this.velocity,
      this.stateManager.vars,
      this.inventory.items.length,
      this.world.showInfo,
      this.world.debugEnabled,
      this.viewRange,
      this.radius
    );
  }

  wrapWorld() {
    // teleport if out of bounds
    this.world.wrapAround(this.position);
    // cost = speed * energy drainRate
    const speed = this.velocity.length();
    const cost = speed * this.config.drainRates.energy;
    this.stateManager.vars.energy = Math.max(0, this.stateManager.vars.energy - cost);
  }
}
