import { egi } from "../utils/graphics.js";
export default class RenderManager {
  constructor(agent, ctx, shape = 'circle') {
    this.agent = agent;
    egi.initialize(ctx);
  }

  draw(position, velocity) {
    // choose shape dynamically
    switch (this.agent.config.shape) {
      case 'pentagon':
        egi.drawPentagon(position, 8);
        break;
      default:
        egi.drawCircle(position, 8);
    }
  }
}
