define(function(require) {
  var SpriteMap = require('./spritemap')

  var Layer = function(engine, config) {
    this.engine = engine
    this.tileset = config.tileset
    this.config = config
    this.image = new SpriteMap(this.tileset.path, this.tileset.tilesize);
  }
  Layer.prototype = {
    render: function(context) {
      for(var x = 0; x < this.config.width; x++) {
        for(var y = 0; y < this.config.height; y++) {
          var index = x + (y * this.config.width)
          var left = x * this.config.tilesize
          var top = y * this.config.tilesize
          this.image.drawTo(context, 
            this.config.data[index], 
            left, 
            top); // TODO: Specify width 
        }
      }
    }
  }
  return Layer
})
