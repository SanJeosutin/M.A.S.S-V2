export class Vector2D {
  constructor(x, y) {
    this.x = x || 500;
    this.y = y || 500;
  }

  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    var len = this.length();
    if (len === 0) {
      return new Vector2D(0, 0);
    }
    return this.divide(len);
  }

  perpendicular() {
    return new Vector2D(-this.y, this.x);
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  truncate(max) {
    if (this.length() > max) {
      var unit = this.normalize();
      this.x = unit.x * max;
      this.y = unit.y * max;
    }
  }
}