define(function(require) {
  var SpriteMap = require('./spritemap')

  var Layer = function(level, index) {
    this.level = level
    this.config = this.level.layerdata(index)
    this.index = index
    this.image = new SpriteMap(this.tileset().path, this.tileset().tilesize);
    this.hidden = false
  }
  Layer.prototype = {
    name: function() {
      return this.config.name
    },
    tileset: function() {
      return this.level.tileset(this.config.tileset)
    },
    setTileAt: function(x, y, tile) {
      this.level.setTileAt(this.index, x, y, tile)
    },
    getTileAt: function(x, y, tile) {
      return this.level.getTileAt(this.index, x, y, tile)
    },
    hide: function() {
      this.hidden = true
    },
    show: function() {
      this.hidden = false
    },
    render: function(context) {
      if(this.hidden) return
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
