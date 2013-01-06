define(function(require) {
  var SpriteMap = require('engine/spritemap')

  var Animation = function(entity, path, spritewidth, spriteheight, fps, steps ) {
    this.entity = entity
    this.path = path
    this.steps = steps
    this.spritemap = entity.game.resources.spritemap(path, spritewidth, spriteheight)
    this.fps = fps
    this.current = 0
    this.ticks = 0
  }

  Animation.prototype = {
    tick: function() {
      if(++this.ticks % this.fps === 0) {
        if(++this.current === this.steps.length)
          this.current = 0
        this.ticks = 0
      }
    },
    render: function(context) {
      var entity = this.entity
      this.spritemap.drawTo(context, this.steps[this.current], 
        entity.x, entity.y, entity.width, entity.height)
    }
  }

  return Animation
})
