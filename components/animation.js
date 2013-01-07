define(function(require) {
  var _ = require('underscore')
  var SpriteMap = require('engine/spritemap')

  var Animation = function(entity, path, spritewidth, spriteheight) {
    this.entity = entity
    this.path = path
    this.spritemap = entity.game.resources.spritemap(path, spritewidth, spriteheight)
    this.currentanimation = 'idle'
    this.current = 0
    this.ticks = 0
    this.animations = {}
    this.entity.handle('set-animation', _.bind(this.setAnimation, this))
  }

  Animation.prototype = {
    tick: function() {
      var anim = this.animations[this.currentanimation]
      if(!anim) return
      if(++this.ticks % anim.fps === 0) {
        if(++this.current === anim.steps.length)
          this.current = 0
        this.ticks = 0
      }
    },
    render: function(context) {
      var anim = this.animations[this.currentanimation]
      if(!anim) return
      var entity = this.entity
      this.spritemap.drawTo(context, anim.steps[this.current], 
        entity.x, entity.y, entity.width, entity.height)
    },
    define: function(name, fps, steps, options) {
      this.animations[name] = {
        fps: fps,
        steps: steps,
        options: options,
        current: 0
      }
    },
    setAnimation: function(animation) {
      if(this.currentanimation === animation) return
      this.currentanimation = animation
      this.current = 0
    }
  }

  return Animation
})
