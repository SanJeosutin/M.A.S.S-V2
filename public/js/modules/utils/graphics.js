export const egi = {
  context: null,
  colors: {
    WHITE: '#ffffff',
    RED: '#ff0000',
    GREEN: '#00ff00',
    BLUE: '#0000ff',
    ORANGE: '#ffa500',
    AQUA: '#00ffff',
    PURPLE: '#800080',
    YELLOW: '#ffff00',
    PINK: '#ffc0cb',
    BROWN: '#a52a2a',
  },

  initialize(ctx) {
    this.context = ctx;
    this.context.font = '12px sans-serif';
  },

  setStrokeWidth(width) {
    this.context.lineWidth = width;
  },

  setStrokeColor(colorName) {
    this.context.strokeStyle = this.colors[colorName] || this.colors.BLACK;
  },

  setFillColor(colorName) {
    this.context.fillStyle = this.colors[colorName] || this.colors.BLACK;
  },

  setColor(colorName) {
    this.setStrokeColor(colorName);
    this.setFillColor(colorName);
  },

  drawCircle(position, radius, fill = false) {
    this.context.beginPath();
    this.context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
    if (fill) this.context.fill();
    else this.context.stroke();
  },

  drawRectangle(position, width, height, fill = false) {
    this.context.beginPath();
    this.context.rect(position.x, position.y, width, height);
    if (fill) this.context.fill();
    else this.context.stroke();
  },

  drawTriangle(p1, p2, p3, fill = false) {
    this.context.beginPath();
    this.context.moveTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    this.context.closePath();
    if (fill) this.context.fill();
    else this.context.stroke();
  },

  drawRhombus(center, width, height, fill = false) {
    const { x, y } = center;
    const halfW = width / 2;
    const halfH = height / 2;
    const points = [
      { x: x, y: y - halfH }, // top
      { x: x + halfW, y: y }, // right
      { x: x, y: y + halfH }, // bottom
      { x: x - halfW, y: y }  // left
    ];
    this.context.beginPath();
    this.context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(pt => this.context.lineTo(pt.x, pt.y));
    this.context.closePath();
    if (fill) this.context.fill();
    else this.context.stroke();
  },

  drawPentagon(center, radius, fill = false) {
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      pts.push({ x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) });
    }
    this.context.beginPath();
    this.context.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      this.context.lineTo(pts[i].x, pts[i].y);
    }
    this.context.closePath();
    if (fill) this.context.fill(); else this.context.stroke();
  },

  drawText(x, y, text, align = 'start') {
    this.context.textAlign = align;
    this.context.fillText(text, x, y);
  },

  drawLineWithArrow(v1, v2, size = 10) {
    // direction vector
    const dx = v2.x - v1.x;
    const dy = v2.y - v1.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) return;
    const nx = dx / len;
    const ny = dy / len;
    // point where arrowhead begins
    const xpoint = { x: v2.x - nx * size, y: v2.y - ny * size };
    // perpendicular vector
    const perpX = -ny;
    const perpY = nx;
    // arrowhead points
    const ap1 = { x: xpoint.x + perpX * size * 0.4, y: xpoint.y + perpY * size * 0.4 };
    const ap2 = { x: xpoint.x - perpX * size * 0.4, y: xpoint.y - perpY * size * 0.4 };

    // draw shaft
    this.context.beginPath();
    this.context.moveTo(v1.x, v1.y);
    this.context.lineTo(xpoint.x, xpoint.y);
    this.context.stroke();

    // draw arrowhead
    this.context.beginPath();
    this.context.moveTo(v2.x, v2.y);
    this.context.lineTo(ap1.x, ap1.y);
    this.context.lineTo(ap2.x, ap2.y);
    this.context.closePath();
    this.context.stroke();
  },
};