define(function(require) {
  var MemoryCanvas = require('./memorycanvas')
  var _ = require('underscore')
  var Eventable = require('eventable')

  var SpriteMap = function(texture, data) {
    Eventable.call(this)
    this.filename = data.path
    this.tilesize = data.tilesize
    this.tiles = data.tiles
    this.collisionmapsize = 0
    this.collisionMaps = []
    this.texture = texture
    this.texture.waitForLoaded(_.bind(this.onLoaded, this))
    this.loaded = false
  }

  SpriteMap.prototype = {
    drawTo: function(context, index,  x, y, width, height) {
      if(!this.loaded) return

      var img = this.texture.get()
      var delta = this.tilesize * index  
      var sx = delta % img.width
      var sy = parseInt(delta / img.width, 10) * this.tilesize

      context.drawImage(img, 
        sx, sy, this.tilesize, this.tilesize,
        x, y, width || this.tilesize, height || this.tilesize)
    },
    generateCollisionMaps: function(width, height) {
      if(!this.loaded) 
        return this.once('loaded', 
          function() { 
            this.generateCollisionMaps(width, height) }, this)

      this.collisionmapsize = width
      var canvas = new MemoryCanvas(width, height)
      for(var name in this.tiles) {
        var index = this.tiles[name]
        canvas.reset()
        this.drawTo(canvas.context, index, 0, 0, width, height)
        this.collisionMaps[index] = canvas.createMap()
      }
    },
    hasPixelAt: function(index, x, y) {
      if(!this.loaded) return false
      var map = this.collisionMaps[index]
      return map[x + y * this.collisionmapsize]
    },
    onLoaded: function() {
      this.loaded = true
      this.raise('loaded')
    }
  }
  _.extend(SpriteMap.prototype, Eventable.prototype)
  return SpriteMap;
})
