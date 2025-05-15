import { egi } from "../utils/graphics.js";

export default class RenderManager {
  constructor(agent, ctx, shape = 'circle') {
    this.agent = agent;
    egi.initialize(ctx);
  }

  draw(position, velocity, stateVars, inventoryCount, showInfo, debugEnabled, viewRange, radius) {
    const angle = Math.atan2(velocity.y, velocity.x);
    let p1, p2, p3;

    // draw shape
    switch (this.agent.config.shape) {
      case 'pentagon':
        egi.drawPentagon(position, 5, true);
        break;

      default:
        egi.drawCircle(position, 8);
    }

    // state info overlay
    if (showInfo) {
      const info =
        ` ⚡${stateVars.energy.toFixed(0)}` +
        ` ❤️${stateVars.health.toFixed(0)}` +
        ` 🍔${stateVars.hunger.toFixed(0)}` +
        ` 💧${stateVars.thirst.toFixed(0)} ` +
        ` 🎒${inventoryCount}`;

      egi.setColor('ORANGE');
      egi.drawText(position.x + 10, position.y + 10, info);
    }

    // debug viewport & heading
    if (debugEnabled) {
      egi.setColor('AQUA');
      egi.drawCircle(position, viewRange);

      const hd = velocity.clone().normalise();
      const hx = position.x + hd.x * 20;
      const hy = position.y + hd.y * 20;

      egi.context.beginPath();
      egi.context.moveTo(position.x, position.y);
      egi.context.lineTo(hx, hy);
      egi.context.stroke();

      egi.drawText(
        position.x + 8,
        position.y + 14,
        'Spd:' + velocity.length().toFixed(1)
      );
    }
  }
}
