define(function(require) {

  var Animation = function(spritemap, data) {
    this.steps = data.steps
    this.fps = data.fps
    this.spritemap = spritemap
    this.current = 0
    this.ticks = 0
  }

  Animation.prototype = {
    tick: function() {
      if(++this.ticks % this.fps === 0) {
        if(++this.current === this.steps)
          this.current = 0
        this.ticks = 0
      }
    },
    render: function(context, x, y, width, height) {
      this.spritemap.drawTo(context, this.current, x, y, width, height)
    }
  }

  return Animation
})
