var RenderTarget = function(targetId) {
  this.targetid = targetId
  this.canvas = document.getElementById(this.targetid)
  this.context = canvas.getContext('2d')
  this.width = this.canvas.width
  this.height = this.canvas.height
}

RenderTarget.prototype = {

}

module.exports = RenderTarget
