define(function(require) {
  var SpriteMap = require('./spritemap')

  var Layer = function(engine, level, index) {
    this.engine = engine
    this.level = level
    this.config = this.level.layers[index]
    this.tileset = this.config.tileset
    this.image = new SpriteMap(this.tileset.path, this.tileset.tilesize);
  }
  Layer.prototype = {
    render: function(context) {
      for(var x = 0; x < this.level.width; x++) {
        for(var y = 0; y < this.level.height; y++) {
          var index = x + (y * this.level.width)
          var left = x * this.level.tilesize
          var top = y * this.level.tilesize
          this.image.drawTo(context, 
            this.config.data[index], 
            left, top, this.level.tilesize, this.level.tilesize);
        }
      }
    }
  }
  return Layer
})
