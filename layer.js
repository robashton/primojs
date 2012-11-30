define(function(require) {
  var SpriteMap = require('./spritemap')

  var Layer = function(engine, config) {
    this.engine = engine
    this.tileset = config.tileset
    this.config = config
    this.lookup = []
    this.initializeLookup()
    this.image = new SpriteMap(this.tileset.path, this.tileset.tilesize);
  }
  Layer.prototype = {
    initializeLookup: function() {
      for(var i = 0 ; i < this.config.data.length; i++) {
        this.lookup.push(this.tileset.tiles[this.config.data[i]])
      }
    },
    render: function(context) {
      for(var x = 0; x < this.config.width; x++) {
        for(var y = 0; y < this.config.height; y++) {
          var index = x + (y * this.config.width)
          var left = x * this.tileset.tilesize
          var top = y * this.tileset.tilesize
          this.image.drawTo(context, this.lookup[index], left, top);
        }
      }
    }
  }
  return Layer
})
