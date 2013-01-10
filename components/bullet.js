define(function(require) {

  var Bullet = function(entity) {
    this.entity = entity
    this.entity.on('collision', this.onCollision, this)
  }

  Bullet.prototype = {
    onCollision: function(other) {
      other.dispatch('hitbybullet')
      this.entity.kill()
    }
  }

  return Bullet
})
