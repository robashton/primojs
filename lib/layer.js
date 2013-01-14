var SpriteMap = require('./spritemap')

var Layer = function(level, index) {
  this.level = level
  this.config = this.level.layerdata(index)
  this.index = index
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
  iscollision: function(value) {
    if(typeof value !== 'undefined') {
      this.config.collision = value
    }
    return !!this.config.collision
  },
  solidAt: function(x, y) {
    var tilex = parseInt( x / this.level.tilesize(), 10)
    var tiley = parseInt( y / this.level.tilesize(), 10)
    var remainderx = x % this.level.tilesize()
    var remaindery = y % this.level.tilesize()

    var index = this.config.data[tilex + tiley * this.level.width()]
    if(index === null) return false
    return this.spritemap().hasPixelAt(index, remainderx, remaindery)
  },
  hide: function() {
    this.hidden = true
  },
  show: function() {
    this.hidden = false
  },
  spritemap: function() {
    return this.level.spritemap(this.config.tileset)
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

        this.spritemap().drawTo(context, 
          this.config.data[index], 
          left, top, this.level.tilesize(), this.level.tilesize());
      }
    }
  }
}
module.exports = Layer
