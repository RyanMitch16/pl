goog.provide('demos.ScaleDemo');

goog.require('goog.math.Vec2');
goog.require('pl.gfx');
goog.require('pl.retained.Animation');
goog.require('pl.retained.Stage');
goog.require('pl.retained.Text');

/**
 * @constructor
 */
demos.ScaleDemo = function(canvas) {
  var container = new pl.retained.Text('Dude', 300, 50);
  container.fillStyle = 'white';
  container.textFillStyle = 'black';

  var vec = new goog.math.Vec2((500 - 300) / 2, (500 - 50) / 2);
  var tx = container.addTransform().setToTranslation(vec.x, vec.y);

  this._stage = new pl.retained.Stage(canvas, container);

  var frames = 50;

  var animation = new pl.retained.Animation(container, frames, function(i, element) {
    var scale = 1 - i / frames;
    pl.gfx.affineOffsetScale(tx, scale, scale, element.width / 2, element.height / 2);
    tx.preTranslate(vec.x, vec.y);
    element.invalidateDraw();
  });
};

demos.ScaleDemo.description = 'Scale';

demos.ScaleDemo.prototype.frame = function() {
  this._stage.draw();
};
