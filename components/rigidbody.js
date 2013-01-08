define(function(require) {
  var _ = require('underscore')

  var RigidBody = function(entity) {
    this.entity = entity
    this.entity.on('collided', _.bind(this.onCollided, this))
    this.entity.handle('collidewith', _.bind(this.collideWith, this))
    this.entity.collideable = true
  }

  RigidBody.prototype = {
    onCollided: function(other) {
      other.dispatch('collidewith', this)
    },
    collideWith: function(other) {
      var entityOne = this.entity
        , entityTwo = other.entity

      entityOne.velx = 0
      entityOne.vely = 0
      entityTwo.velx = 0
      entityTwo.vely = 0
    }
  }

  return RigidBody

})
