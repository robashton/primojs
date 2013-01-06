define(function(require) {
  var MemoryCanvas = require('./memorycanvas')
  var _ = require('underscore')
  var Eventable = require('eventable')

  var SpriteMap = function(texture, spritewidth, spriteheight) {
    Eventable.call(this)
    this.spritewidth = spritewidth
    this.spriteheight = spriteheight
    this.tilecount = 0
    this.tilecountwidth = 0
    this.tilecountheight = 0
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

      var rownumber = Math.floor(index / this.tilecountwidth)
      var columnnumber = index % this.tilecountwidth

      var sx = columnnumber * this.spritewidth
      var sy = rownumber * this.spriteheight

      context.drawImage(img, 
        sx, sy, this.spritewidth, this.spriteheight,
        x, y, width || this.spritewidth, height || this.spriteheight)
    },
    generateCollisionMaps: function(width, height) {
      if(!this.loaded) 
        return this.once('loaded', 
          function() { 
            this.generateCollisionMaps(width, height) }, this)

      this.collisionmapsize = width
      var canvas = new MemoryCanvas(width, height)

      for(var i = 0; i < this.tilecount ; i++) {
        canvas.reset()
        this.drawTo(canvas.context, i, 0, 0, width, height)
        this.collisionMaps[i] = canvas.createMap()
      }
    },
    hasPixelAt: function(index, x, y) {
      if(!this.loaded) return false
      var map = this.collisionMaps[index]
      return map[x + y * this.collisionmapsize]
    },
    onLoaded: function() {
      this.loaded = true
      var img = this.texture.get()
      this.tilecountwidth = img.width / this.spritewidth
      this.tilecountheight = img.height / this.spriteheight
      this.tilecount = this.tilecountwidth * this.tilecountheight
      this.raise('loaded')
    }
  }
  _.extend(SpriteMap.prototype, Eventable.prototype)
  return SpriteMap;
})
