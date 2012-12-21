define(function(require) {
  var SpriteMap = require('./spritemap')

  var Layer = function(level, index) {
    this.level = level
    this.config = this.level.layerdata(index)
    this.tileset = this.level.tileset(this.config.tileset)
    this.image = new SpriteMap(this.tileset.path, this.tileset.tilesize);
  }
  Layer.prototype = {
    render: function(context) {
      for(var x = 0; x < this.level.width() ; x++) {
        for(var y = 0; y < this.level.height() ; y++) {
          var index = x + (y * this.level.width())
          var left = x * this.level.tilesize()
          var top = y * this.level.tilesize()

          if(this.config.data[index] === null)
            continue

          this.image.drawTo(context, 
            this.config.data[index], 
            left, top, this.level.tilesize(), this.level.tilesize());
        }
      }
    }
  }
  return Layer
})
