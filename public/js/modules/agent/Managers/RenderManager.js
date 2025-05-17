import { egi } from "../../utils/graphics.js";

export default class RenderManager {
  constructor(agent, ctx, shape = 'circle') {
    this.agent = agent;
    egi.initialize(ctx);
  }

  draw(position, velocity, stateVars, inventoryCount, showInfo, debugEnabled, viewRange, radius) {
    const angle = velocity.length() > 0 ? Math.atan2(velocity.y, velocity.x) : 0;

    // draw shape
    switch (this.agent.config.shape) {
      case 'triangle':
        egi.drawTriangle(
          {
            x: position.x + radius * Math.cos(angle),
            y: position.y + radius * Math.sin(angle)
          },
          {
            x: position.x + radius * Math.cos(angle + (4 * Math.PI / 5)),
            y: position.y + radius * Math.sin(angle + (4 * Math.PI / 5))
          },
          {
            x: position.x + radius * Math.cos(angle - (4 * Math.PI / 5)),
            y: position.y + radius * Math.sin(angle - (4 * Math.PI / 5))
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

      egi.drawText(position.x + 10, position.y + 10, info);
    }

    // debug viewport & heading
    if (debugEnabled) {
      egi.drawCircle(position, viewRange);

      const hd = velocity.clone().normalise();
      const speed = velocity.length();
      const arrowLen = speed * 0.75;

      const tip = {
        x: position.x + hd.x * arrowLen,
        y: position.y + hd.y * arrowLen
      };

      // 4) Draw arrow for “where I’m heading”
      egi.setStrokeColor('YELLOW');
      egi.setStrokeWidth(2);
      egi.drawLineWithArrow(position, tip, radius * 1.5);
    }

    egi.drawText(
      position.x + 8,
      position.y + 14,
      'Speed: ' + velocity.length().toFixed(1)
    );
  }
}
