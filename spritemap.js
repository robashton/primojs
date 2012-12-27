define(function(require) {
  var MemoryCanvas = require('./memorycanvas')
  var _ = require('underscore')
  var Eventable = require('eventable')

  var SpriteMap = function(data) {
    Eventable.call(this)

    this.filename = data.path
    this.tilesize = data.tilesize
    this.tiles = data.tiles
    this.collisionMaps = []
    this.data = new Image()
    this.data.src = this.filename
    this.loaded = false
    this.data.onload = _.bind(this.onLoaded, this)
  }

  SpriteMap.prototype = {
    drawTo: function(context, index,  x, y, width, height) {
      if(!this.loaded) return

      var delta = this.tilesize * index  
      var sx = delta % this.data.width
      var sy = parseInt(delta / this.data.width, 10) * this.tilesize

      context.drawImage(this.data, 
        sx, sy, this.tilesize, this.tilesize,
        x, y, width || this.tilesize, height || this.tilesize)
    },
    generateCollisionMaps: function(width, height) {
      if(!this.loaded) 
        return this.once('loaded', 
          function() { 
            this.generateCollisionMaps(width, height) }, this)

      var canvas = new MemoryCanvas(width, height)
      for(var name in this.tiles) {
        var index = this.tiles[name]
        canvas.reset()
        this.drawTo(canvas.context, index, 0, 0, width, height)
        this.collisionMaps[index] = canvas.createMap()
      }
    },
    onLoaded: function() {
      this.loaded = true
      this.raise('loaded')
    }
  }
  _.extend(SpriteMap.prototype, Eventable.prototype)
  return SpriteMap;
})
