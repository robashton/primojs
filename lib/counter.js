var Counter = function(name) {
  this.name = name
  this.average = 0
  this.last = 0
  this.current = null
}

Counter.prototype = {
  start: function() {
    this.current = new Date().getTime()
  },
  end: function()  {
    var now = new Date().getTime()
    var diff = now - this.current
    this.average = (diff + this.average) / 2.0
  },
  frametime: function() {
    return parseInt(this.average, 10)
  }
}
module.exports = Counter

