import { Vector2D } from "../utils/vector2d.js";

import MovementManager from "./Managers/MovementManager.js";
import RenderManager from "./Managers/RenderManager.js";
import StateManager from "./Managers/StateManager.js";
import behaviourManager from "./Managers/BehaviourManager.js";
import InventoryManager from "./Managers/InventoryManager.js";

export default class Agent {
  static nextId = 1;

  static agentStats = {
    energy: 100,
    health: 100,
    hunger: 100,
    thirst: 100,
  }

  static steerConfig = {
    wanderRadius: 5,
    wanderDistance: 20,
    wanderJitter: 80,
  }

  static agentConfig = {
    drainRates: { energy: 0.01, hunger: 1.0, thirst: 1.5 },
    inventoryCapacity: 5,
    shape: 'triangle',
    viewRange: 125,
    radius: 8,
    speed: 50,
    mass: 5,  // lower = more responsive, higher = “heavier”
    force: 10,    // tweak to control acceleration
  };

  constructor(position, world, home, config = {}, stats = {}, steerConfig = {}) {
    this.id = Agent.nextId++;
    this.world = world;
    this.home = home;
    this.color = home.color;

    this.stats = { ...Agent.agentStats, ...stats };
    this.config = { ...Agent.agentConfig, ...config };
    this.steerConfig = { ...Agent.steerConfig, ...steerConfig };

    // State, Inventory, Movement, behaviour, Rendering
    this.position = position.clone();
    this.velocity = new Vector2D(0, 0);
    this.viewRange = this.config.viewRange;
    this.radius = this.config.radius;

    this.mass = this.config.mass;
    this.maxForce = this.config.force;
    this.baseSpeed = this.config.speed;
    this.maxSpeed = this.config.speed;

    // steering behaviour state
    this.heading = new Vector2D(1, 0);
    this.side = this.heading.perp();
    this.wanderTarget = new Vector2D(0, 0);
    this.wanderRadius = this.steerConfig.wanderRadius;
    this.wanderDistance = this.steerConfig.wanderDistance;
    this.wanderJitter = this.steerConfig.wanderJitter;

    this.inventory = new InventoryManager(this.config.inventoryCapacity);
    this.stateManager = new StateManager(this.stats, this.config.drainRates);
    this.movementManager = new MovementManager(this, this.config.speed);
    this.behaviourManager = new behaviourManager(this);
    this.renderManager = new RenderManager(this, this.world.ctx, this.config.shape);

    this.isDead = false;
    this.isExhaused = false;
  }

  update(delta) {
    // update internal state
    this.stateManager.update(delta);

    // determine behaviour (updates velocity through steering)
    this.behaviourManager.update(delta);

    let steeringForce = this.behaviourManager.update(this, delta);
    // guard against undefined or invalid return
    if (!(steeringForce instanceof Vector2D)) {
      steeringForce = new Vector2D(0, 0);
    }

    // 3) Convert steering force into acceleration: a = F / m
    const acceleration = steeringForce.clone().divide(this.mass);

    // 4) Integrate velocity: v = v + a * dt
    this.velocity.add(acceleration.multiply(delta))
      .truncate(this.maxSpeed);

    // 5) Integrate position: p = p + v * dt
    this.position.add(this.velocity.clone().multiply(delta));

    // 6) Apply damping when no steering to avoid coasting
    if (steeringForce.length() < 0.01) {
      const damping = this.config.dampingFactor ?? 0.9;
      this.velocity.multiply(damping);
    }

    // optional: also let MovementManager handle GOAP moveToward
    this.movementManager.update(delta);

    // wrap world bounds & energy drain
    this.wrapWorld(delta);

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

  moveToward(targetPos) {
    const dir = targetPos.subtract(this.position);
    const dist = dir.length();
    if (dist < 1e-6) return;           // already basically there

    // step no farther than “dist” so we never overshoot
    const stepSize = Math.min(dist, this.baseSpeed);
    const step = dir.divide(dist).multiply(stepSize);

    this.position = this.position.add(step);
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
