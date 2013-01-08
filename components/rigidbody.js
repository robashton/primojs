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
      // At this point, we have two entities with rigid bodies
      // and can therefore do some magic

    }
  }

  return RigidBody

})
