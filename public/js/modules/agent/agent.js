import {Vector2D} from "../utils/vector2d.js";
import MovementManager from "./MovementManager.js";
import RenderManager from "./RenderManager.js";
import StateManager from "./StateManager.js";
import behaviourManager from "./BehaviourManager.js";
import InventoryManager from "./InventoryManager.js";

export default class Agent {
  static nextId = 1;
  static defaultConfig = {
    initialState: { energy: 100, health: 100, hunger: 100, thirst: 100 },
    inventoryCapacity: 5,
    baseSpeed: 50,
    drainRates: { energy: 0.1, hunger: 1.0, thirst: 1.5 },
    shape: 'triangle', // customizable render shape
  };

  constructor(position, world, home, config = {}) {
    this.id = Agent.nextId++;
    this.world = world;
    this.home = home;
    this.config = { ...Agent.defaultConfig, ...config };

    // State, Inventory, Movement, behaviour, Rendering
    this.stateManager    = new StateManager(this.config.initialState, this.config.drainRates);
    this.inventory       = new InventoryManager(this.config.inventoryCapacity);
    this.position        = position.clone();
    this.velocity        = new Vector2D(0, 0);
    this.movementManager = new MovementManager(this, this.config.baseSpeed);
    this.behaviourManager = new behaviourManager(this);
    this.renderManager   = new RenderManager(this, this.world.ctx, this.config.shape);
  }

  update(delta) {
    this.stateManager.update(delta);
    this.behaviourManager.update(delta);
    this.movementManager.update(delta);
  }

  render() {
    this.renderManager.draw(this.position, this.velocity);
  }
}
