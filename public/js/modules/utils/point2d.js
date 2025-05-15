export class Point2D {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  copy() { return new Point2D(this.x, this.y); }
}