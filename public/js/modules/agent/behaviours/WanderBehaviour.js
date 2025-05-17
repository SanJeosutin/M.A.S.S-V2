import { Vector2D } from "../../utils/vector2d.js";
import { DECELERATION_SPEEDS } from "./SteeringBehaviour.js"; // adjust path as needed

export default class WanderBehaviour {
  constructor(agent) {
    this.agent = agent;
    this.wanderAngle = 0;
    // steer settings (could also be on agent)
    this.wanderRadius = agent.wanderRadius || 5;
    this.wanderDistance = agent.wanderDistance || 20;
    this.wanderJitter = agent.wanderJitter || 0.3;
  }

  // WANDER steer
  wander(delta) {
    // jitter the wander angle
    this.wanderAngle += (Math.random() * 2 - 1) * this.wanderJitter * delta;
    // calculate circle center ahead of agent
    const circleCenter = this.agent.velocity.clone()
      .normalise()
      .multiply(this.wanderDistance);
    // displacement vector on circle perimeter
    const displacement = new Vector2D(
      Math.cos(this.wanderAngle) * this.wanderRadius,
      Math.sin(this.wanderAngle) * this.wanderRadius
    );
    // wander force is center + displacement
    return circleCenter.add(displacement);
  }

  // SEEK steer toward a target
  seek(targetPos) {
    const desired = targetPos
      .subtract(this.agent.position)
      .normalise()
      .multiply(this.agent.baseSpeed);
    return desired.subtract(this.agent.velocity);
  }

  // ARRIVE steer with smooth deceleration
  arrive(targetPos, decel = 'normal') {
    const toTarget = targetPos.subtract(this.agent.position);
    const dist = toTarget.length();
    if (dist > 0) {
      const factor = DECELERATION_SPEEDS[decel] || DECELERATION_SPEEDS.normal;
      let speed = dist / factor;
      speed = Math.min(speed, this.agent.baseSpeed);
      const desired = toTarget.multiply(speed / dist);
      return desired.subtract(this.agent.velocity);
    }
    return new Vector2D(0, 0);
  }

  // main entry: choose steer based on current GOAP action
  execute(delta) {
    let steer;
    const action = this.agent.behaviourManager.currentAction;
    const name = action ? action.name : null;

    if (name === 'CollectItem' || name === 'HelpTeammate' || name === 'UsePersonalItem') {
      steer = this.seek(action.target.position);
    } else if (name === 'ReturnItem') {
      steer = this.arrive(this.agent.home.position, 'normal');
    } else {
      steer = this.wander(delta);
    }

    // apply steering to velocity
    this.agent.velocity = this.agent.velocity
      .add(steer)
      .normalise()
      .multiply(this.agent.baseSpeed);

    // move agent by velocity scaled by delta
    this.agent.position = this.agent.position.add(
      this.agent.velocity.multiply(delta)
    );

    // update heading/side for transforms
    if (this.agent.velocity.length() > 0) {
      this.agent.heading = this.agent.velocity.clone().normalise();
      this.agent.side = this.agent.heading.perp();
    }

    // default wander collision pick-up
    for (const item of this.agent.world.items) {
      const dist = this.agent.position.distance(item.position);
      if (dist <= this.agent.radius + item.radius) {
        this.agent.inventory.add(item);
        this.agent.world.remove(item);
        console.log(`[WanderBehaviour] Agent ${this.agent.id} picked up item during wander`);
        break;
      }
    }
  }
}
