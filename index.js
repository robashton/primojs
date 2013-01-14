var Entity = require('./lib/entity')
var Game = require('./lib/game')

module.exports = {
  DefineEntity: Entity.Define,
  Create: function(targetId) {
    return new Game(targetId)
  }

}
