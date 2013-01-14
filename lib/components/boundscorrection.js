var BoundsCorrection = function(entity, minx, miny, maxx, maxy) {
  this.entity = entity
  this.minx = minx
  this.miny = miny
  this.maxx = maxx
  this.maxy = maxy
}

BoundsCorrection.prototype = {
  tick: function() {
    if(this.entity.x < this.minx)
      this.entity.x = this.minx
    if(this.entity.x > this.maxx)
      this.entity.x = this.maxx
    if(this.entity.y < this.miny)
      this.entity.y = this.miny
    if(this.entity.y > this.maxy)
      this.entity.y = this.maxy
  }
}

module.exports = BoundsCorrection
