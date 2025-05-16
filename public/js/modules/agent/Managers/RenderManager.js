import { egi } from "../../utils/graphics.js";

export default class RenderManager {
  constructor(agent, ctx, shape = 'circle') {
    this.agent = agent;
    egi.initialize(ctx);
  }

  draw(position, velocity, stateVars, inventoryCount, showInfo, debugEnabled, viewRange, radius) {
    const angle = velocity.length() > 0
      ? Math.atan2(velocity.y, velocity.x)
      : 0;

    // draw shape
    switch (this.agent.config.shape) {
      case 'triangle':
        egi.drawTriangle(
          {
            x: position.x + radius * Math.cos(angle),
            y: position.y + radius * Math.sin(angle)
          }, 
          {
            x: position.x +  radius * Math.cos(angle +  (4 * Math.PI / 5)),
            y: position.y +  radius * Math.sin(angle +  (4 * Math.PI / 5))
          },
          {
            x: position.x +  radius * Math.cos(angle -  (4 * Math.PI / 5)),
            y: position.y +  radius * Math.sin(angle -  (4 * Math.PI / 5))
          },
          true
        );
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
        'Speed: ' + velocity.length().toFixed(1)
      );
    }
  }
}
