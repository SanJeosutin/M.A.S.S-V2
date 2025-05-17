const MIN_FLOAT = 1e-8;

export class Vector2D {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
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

  // set components to zero
  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  // check if vector is near zero length
  isZero() {
    return (this.x * this.x + this.y * this.y) < MIN_FLOAT;
  }

  // length (magnitude)
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // squared length (avoid sqrt)
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  // normalise in place
  normalise() {
    const len = this.length();
    if (len > 0) {
      this.x /= len;
      this.y /= len;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  // return a new normalized vector
  getNormalised() {
    return this.copy().normalise();
  }

  // dot product
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  // +1 if v is clockwise of this, -1 if anticlockwise
  sign(v) {
    // assumes y down and x right
    return (this.y * v.x > this.x * v.y) ? -1 : 1;
  }

  // perpendicular vector
  perp() {
    return new Vector2D(-this.y, this.x);
  }

  // truncate length to max
  truncate(max) {
    const len = this.length();
    if (len > max) {
      this.normalise();
      this.multiply(max);
    }
    return this;
  }

  // distance to another vector
  distance(v) {
    const dx = v.x - this.x;
    const dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // squared distance
  distanceSq(v) {
    const dx = v.x - this.x;
    const dy = v.y - this.y;
    return dx * dx + dy * dy;
  }

  // reflect this vector about normal 'norm'
  reflect(norm) {
    // reflect direction: r = v - 2*(v·n)*n
    const dot2 = 2 * this.dot(norm);
    this.x -= dot2 * norm.x;
    this.y -= dot2 * norm.y;
    return this;
  }

  // return reversed vector
  getReverse() {
    return new Vector2D(-this.x, -this.y);
  }

  // alias for getReverse
  negate() {
    return this.getReverse();
  }

  // copy this vector
  copy() {
    return new Vector2D(this.x, this.y);
  }
  // equality check within tolerance
  equals(v) {
    return (
      Math.abs(this.x - v.x) < MIN_FLOAT &&
      Math.abs(this.y - v.y) < MIN_FLOAT
    );
  }

  // inequality
  notEquals(v) {
    return !this.equals(v);
  }

  // string representation
  toString() {
    return `[${this.x.toFixed(2)}, ${this.y.toFixed(2)}]`;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }
}