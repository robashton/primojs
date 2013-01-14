define(function(require) {

  var Timer = function(desiredFps) {
    this.timeAtLastFrame = new Date().getTime()
    this.idealTimePerFrame = 1000 / desiredFps
    this.leftover = 0
  }

  Timer.prototype = {
    tick: function(cb) {
      var timeAtThisFrame = new Date().getTime()
        , timeSinceLastTick = timeAtThisFrame - this.timeAtLastFrame + this.leftover
        , catchUpFrameCount = Math.floor(timeSinceLastTick / this.idealTimePerFrame)

      for(var i = 0; i < catchUpFrameCount; i++)
        cb()

      this.leftover = timeSinceLastTick - (catchUpFrameCount * this.idealTimePerFrame)
      this.timeAtLastFrame = timeAtThisFrame
    }
  }

  return Timer
})
