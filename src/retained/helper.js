goog.provide('pl.retained.Helper');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.array');
goog.require('pl.retained.Element');
goog.require('pl.ex');
goog.require('pl.gfx');

/**
 * @param {!pl.retained.Element} element
 * @returns {!goog.graphics.AffineTransform}
 */
pl.retained.Helper.getTransform = function(element) {
  var tx = goog.graphics.AffineTransform.getTranslateInstance(element.x, element.y);
  if (element.transform) {
    tx.concatenate(element.transform);
  }
  return tx;
};

/**
 * @param {!pl.retained.Stage} stage
 */
pl.retained.Helper.borderElements = function(stage) {
  var ctx = stage.getContext();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.beginPath();
  pl.retained.Helper._borderElement(ctx, stage.getRoot());
  ctx.stroke();
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {!pl.retained.Element} element
 * @param {boolean=} opt_excludeChildren
 */
pl.retained.Helper._borderElement = function(ctx, element, opt_excludeChildren) {
  var tx = pl.retained.Helper.getTransform(element);
  pl.gfx.transform(ctx, tx);
  ctx.strokeRect(0,0,element.width,element.height);

  if (!opt_excludeChildren) {
    goog.array.forEach(element.getVisualChildren(), function(e) {
      ctx.save();
      pl.retained.Helper._borderElement(ctx, e);
      ctx.restore();
    });
  }
};

/**
 * @param {!pl.retained.Stage} stage
 * @param {number} x
 * @param {number} y
 */
pl.retained.Helper.hitTest = function(stage, x, y) {
  return pl.retained.Helper._hitTest(stage.getRoot(), x, y);
};

/**
 * @param {!pl.retained.Element} element
 * @param {number} x
 * @param {number} y
 */
pl.retained.Helper._hitTest = function(element, x, y) {
  var point = [x, y];
  pl.retained.Helper.getTransform(element).createInverse().transform(point, 0, point, 0, 1);

  var c = new goog.math.Coordinate(point[0], point[1]);
  var bounds = new goog.math.Rect(0, 0, element.width, element.height);

  var hits = [];
  if (bounds.contains(c)) {

    var children = element.getVisualChildren(true);

    for (var i = 0; i < children.length; i++) {
      var e = children[i];
      hits = pl.retained.Helper._hitTest(e, c.x, c.y);
      if (hits.length) {
        break;
      }
    }
    goog.array.insertAt(hits, element);
    return hits;
  } else {
    return [];
  }
};

/**
 * @param {!pl.retained.Stage} stage
 */
pl.retained.Helper.borderHitTest = function(stage, x, y) {
  var ctx = stage.getContext();

  var hits = pl.retained.Helper.hitTest(stage, x, y);
  if (hits.length) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,255,0.5)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    goog.array.forEach(hits, function(e) {
      pl.retained.Helper._borderElement(ctx, e, true);
    });
    ctx.stroke();
    ctx.restore();
  }
};
