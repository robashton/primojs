var _ = require('underscore')
var MemoryCanvas = require('primo-canvas')
var Eventable = require('primo-events')

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
  this.loaded = false
  this.texture.waitForLoaded(_.bind(this.onLoaded, this))
}

SpriteMap.prototype = {
  drawTo: function(context, index,  x, y, width, height, flipx, flipy) {
    if(!this.loaded) return

    var img = this.texture.get()

    var rownumber = Math.floor(index / this.tilecountwidth)
    var columnnumber = index % this.tilecountwidth

    var sx = columnnumber * this.spritewidth
    var sy = rownumber * this.spriteheight

    var scalex = flipx ? -1 : 1
    var scaley = flipy ? -1 : 1

    if(flipx || flipy) {
      context.save()
      context.scale(scalex, scaley)
      x *= scalex
      y *= scaley
      if(flipx)
        x -= width
      if(flipy)
        y -= height
    }

    context.drawImage(img, 
      sx, sy, this.spritewidth, this.spriteheight,
      x, y , width || this.spritewidth, height || this.spriteheight)

    if(flipx || flipy) 
      context.restore()
  },
  generateCollisionMaps: function(width, height) {
    if(!this.loaded) 
      return this.once('loaded', 
        function() { 
          this.generateCollisionMaps(width, height) }, this)

    this.collisionmapsize = width
    var canvas = new MemoryCanvas(width, height)

    try {
      for(var i = 0; i < this.tilecount ; i++) {
        canvas.reset()
        this.drawTo(canvas.context, i, 0, 0, width, height)
        this.collisionMaps[i] = canvas.createMap()
      }
    }
    catch(ex) {
      throw ex
    }
    finally {
      canvas.dispose()
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

module.exports = SpriteMap
