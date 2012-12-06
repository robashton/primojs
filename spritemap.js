define(function(require) {
  var cache = {}

  function create(filename) {
    var image = new Image()
    image.src = filename
    cache[image] = image
    return image
  }

  function fromCache(filename) {
    return cache[filename] || create(filename)
  }

  var SpriteMap = function(filename, tilesize) {
    this.filename = filename
    this.tilesize = tilesize
    this.data = fromCache(filename)
  }

  SpriteMap.prototype = {
    drawTo: function(context, index,  x, y, width, height) {

      var delta = this.tilesize * index  
      var sx = delta % this.data.width
      var sy = parseInt(delta / this.data.width, 10) * this.tilesize

      context.drawImage(this.data, 
        sx, sy, this.tilesize, this.tilesize,
        x, y, width || this.tilesize, height || this.tilesize)
    }
  }
  return SpriteMap;
})
