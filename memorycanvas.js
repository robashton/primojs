define(function(require) {
  var MemoryCanvas = function(width, height) {
    this.width = width
    this.height = height
    this.canvas = document.createElement('canvas')
    this.canvas.width = width 
    this.canvas.height = height 
    this.context = this.canvas.getContext('2d')
  }
  MemoryCanvas.prototype = {
    reset: function() {
      this.context.setTransform(1, 0, 0, 1, 0, 0)
      this.context.clearRect(0,0, this.width, this.height)
    },
    setup: function(width, height) {
      this.reset()

      var scalex = this.width / width
        , scaley = this.height / height

      this.context.scale(scalex, scaley)
    },
    getImage: function() {
      return this.canvas.toDataURL()
    },
    createMap: function() {
      var data = this.context.getImageData(0,0, this.width, this.height).data
      var map = new Array(this.width * this.height)
      for(var y = 0; y < this.height; y++) {
        for(var x = 0; x < this.width; x++) {
          var index = x + y*this.width
          var pixelindex = index * 4
          var total = data[pixelindex] + data[pixelindex+1] + data[pixelindex+2]
          if(total)
            map[index] = 1
          else
            map[index] = 0
        }
      }
      return map
    }
  }
  return MemoryCanvas
})
