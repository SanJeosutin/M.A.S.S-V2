export class Matrix33 {
  constructor(matrixArray) {
    if (matrixArray instanceof Matrix33) {
      this.elements = matrixArray.elements.slice();
    } else {
      this.elements = matrixArray || [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ];
    }
  }

  static buildTransform(position, heading, side) {
    var matrix = new Matrix33();
    matrix.elements = [
      heading.x, side.x, 0,
      heading.y, side.y, 0,
      position.x, position.y, 1
    ];
    return matrix;
  }

  transformPoints(points) {
    var m = this.elements;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var x = p.x;
      var y = p.y;
      p.x = x * m[0] + y * m[3] + m[6];
      p.y = x * m[1] + y * m[4] + m[7];
    }
  }
}