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
    BLACK: '#000000'
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

  drawText(x, y, text, align = 'start') {
    this.context.textAlign = align;
    this.context.fillText(text, x, y);
  }
};