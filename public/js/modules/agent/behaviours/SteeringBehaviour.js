import { Vector2D } from "../../utils/vector2d.js";

/**
 * Deceleration lookup for the arrive behavior.
 */
export const DECELERATION_SPEEDS = {
  slow:   3,
  normal: 2,
  fast:   1
};

/**
 * Wander behavior: random jitter around a projected circle in front of agent.
 * Requires agent to have: wanderTarget (Vector2D), wanderRadius (number),
 * wanderDistance (number), wanderJitter (number), heading (Vector2D), side (Vector2D).
 * @param {Object} agent - The agent instance
 * @param {number} delta - Time step in seconds
 * @returns {Vector2D} steering force
 */
export function wander(agent, delta) {
  // jitter the target
  const jitter = agent.wanderJitter * delta;
  agent.wanderTarget.x += (Math.random() * 2 - 1) * jitter;
  agent.wanderTarget.y += (Math.random() * 2 - 1) * jitter;
  // re-normalize to radius
  agent.wanderTarget.normalise();
  agent.wanderTarget.multiply(agent.wanderRadius);

  // project ahead of agent
  const localTarget = agent.wanderTarget.clone().add(new Vector2D(agent.wanderDistance, 0));

  // transform to world space
  const worldTarget = agent.world.transformMatrix(
    agent.position,
    agent.heading,
    agent.side
  ).transformPoint(localTarget);

  // steering = desired - current velocity
  return worldTarget.subtract(agent.position).subtract(agent.velocity);
}

/**
 * Seek behavior: steer towards a target position at max speed.
 * @param {Object} agent
 * @param {{x:number,y:number}} targetPos
 * @returns {Vector2D} steering force
 */
export function seek(agent, targetPos) {
  const desired = targetPos
    .subtract(agent.position)
    .normalise()
    .multiply(agent.maxSpeed);
  return desired.subtract(agent.velocity);
}

/**
 * Arrive behavior: approach target and decelerate.
 * @param {Object} agent
 * @param {{x:number,y:number}} targetPos
 * @param {'slow'|'normal'|'fast'} decelType
 * @returns {Vector2D} steering force
 */
export function arrive(agent, targetPos, decelType = 'normal') {
  const toTarget = targetPos.subtract(agent.position);
  const dist = toTarget.length();
  if (dist > 0) {
    const decel = DECELERATION_SPEEDS[decelType] || DECELERATION_SPEEDS.normal;
    let speed = dist / decel;
    speed = Math.min(speed, agent.maxSpeed);
    const desired = toTarget.multiply(speed / dist);
    return desired.subtract(agent.velocity);
  }
  return new Vector2D(0, 0);
}
