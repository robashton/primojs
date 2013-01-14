var Text = function(entity, text, colour) {
  this.entity = entity
  this.text = text
  this.colour = colour || '#FFF'
}

Text.prototype = {
  render: function(context) {
    context.fillStyle = this.colour
    context.font = this.entity.height + 'px sans-serif'
    context.fillText(this.text, this.entity.x, this.entity.y)
  },
  display: function(text) {
    this.text = text
  }
}

module.exports = Text
