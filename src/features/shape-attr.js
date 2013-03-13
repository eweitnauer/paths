ShapeAttribute = function(other) {
  this.name = 'shape';
  this.type = 'nominal';
  this.labels = ['circle', 'triangle', 'rectangle', 'square', 'unknown'];
  this.val = "?";
}

/// Returns an ShapeAttribute instance, which is the perception of the passed
/// object's shape. Possible shapes are circle, triangle, rectangle, square and
/// unknown.
ShapeAttribute.perceive = function(obj) {
  var sa = new ShapeAttribute();
  sa.val = ShapeAttribute.determineShape(obj);
  return sa;
}

ShapeAttribute.determineShape = function(shape) {
  // determine shape type (circle, triangle, square, rectangle or unknown)
  if (shape instanceof Polygon) {
    if (!shape.closed) return 'unknown';
    shape.order_vertices();
    if (shape.pts.length == 3) return 'triangle';
    if (ShapeAttribute.isRectangle(shape)) {
      // in square, all edges should have the same length
      var edges = shape.get_edge_lengths(true); // sorted by length
      if (edges[0]/edges[3] < 0.7) return 'rectangle';
      else return 'square';
    }
    else return 'unknown';
  } else if (shape instanceof Circle) return 'circle';
  else return 'unknown';
}

/// Returns true, if Polygon has 4 corners, all with angles in [70,110] degree.
ShapeAttribute.isRectangle = function(poly) {
  if (poly.pts.length != 4) return false;
  var a_max = 110 * Math.PI / 180, a_min = 70 * Math.PI / 180;
  for (var i=0; i<poly.pts.length; ++i) {
    if (poly.angle(i) > a_max || poly.angle(i) < a_min) return false;
  }
  return true;
}

