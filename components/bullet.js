define(function(require) {

  var Bullet = function(entity) {
    this.entity = entity
    this.entity.on('collided', this.onCollided, this)
    this.entity.collideable = true
  }

  Bullet.prototype = {
    onCollided: function(other) {
      other.dispatch('hitbybullet')
      this.entity.kill()
    }
  }

  return Bullet
})
