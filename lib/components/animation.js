var _ = require('underscore')
var SpriteMap = require('primo-spritemap')

var Animation = function(entity, path, spritewidth, spriteheight) {
  this.entity = entity
  this.path = path
  this.spritemap = entity.game.resources.spritemap(path, spritewidth, spriteheight)
  this.currentanimation = 'idle'
  this.current = 0
  this.totalFrameTime = 0
  this.animations = {}
  this.entity.handle('set-animation', _.bind(this.setAnimation, this))
}

Animation.prototype = {
  tick: function(frameTime) {
    var anim = this.animations[this.currentanimation]
    if(!anim) return
    this.totalFrameTime += frameTime
    if(this.totalFrameTime >= anim.timePerFrame) {
      if(++this.current === anim.steps.length)
        this.current = 0
      this.totalFrameTime = 0
    }
  },
  render: function(context) {
    var anim = this.animations[this.currentanimation]
    if(!anim) return
    var entity = this.entity
    this.spritemap.drawTo(context, anim.steps[this.current], 
      entity.x, entity.y, entity.width, entity.height, 
      anim.options.flipx, anim.options.flipy, entity.rotation)
  },
  define: function(name, timePerFrame, steps, options) {
    this.animations[name] = {
      timePerFrame: timePerFrame,
      steps: steps,
      options: options || {},
      current: 0
    }
    return this
  },
  setAnimation: function(animation) {
    if(this.currentanimation === animation) return
    this.currentanimation = animation
    this.current = 0
  }
}

module.exports = Animation
