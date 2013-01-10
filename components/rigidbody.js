define(function(require) {
  var _ = require('underscore')
  var util = require('../commons')

  var RigidBody = function(entity, options) {
    options = options || {}
    this.entity = entity
    this.entity.on('collided', _.bind(this.onCollided, this))
    this.entity.handle('collidewith', _.bind(this.collideWith, this))
    this.entity.collideable = true
    this.group = util.valueOrDefault(options.group, 'none')
    this.weight = util.valueOrDefault(options.weight, 10)
    this.currentIntersection = {}
  }

  RigidBody.prototype = {
    onCollided: function(other) {
      other.dispatch('collidewith', this)
    },
    collideWith: function(other) {
      var entityOne = this.entity
        , entityTwo = other.entity

      if(this.group === other.group && this.group !== 'none')
        return

      var entityOnePercentage = 0
      var entityTwoPercentage = 0

      if(this.weight > other.weight) {
        entityOnePercentage = other.weight / (other.weight + this.weight)
        entityTwoPercentage = 1.0 - entityOnePercentage
      }
      else if(this.weight < other.weight) {
        entityTwoPercentage = this.weight / (other.weight + this.weight)
        entityOnePercentage = 1.0 - entityTwoPercentage
      }
      else {
        entityOnePercentage = 0.5
        entityTwoPercentage = 0.5
      }

      var intersection = this.calculateIntersectionBetween(entityOne, entityTwo)

      entityOne.x += intersection.x * (entityOnePercentage * 1.05)
      entityOne.y += intersection.y * (entityOnePercentage * 1.05)
      entityTwo.x -= intersection.x * (entityTwoPercentage * 1.05)
      entityTwo.y -= intersection.y * (entityTwoPercentage * 1.05)

      /*
      // var p1 = (vX, vY)
      // var p2 = (vX, vY)
      // var i = 

      var angleOne = entityOne.angleOfTravel()
        , angleTwo = entityTwo.angleOfTravel()
        , speedOne = k



      // Can we work out the angle of the collision and 
      // therefore the separation we need to take place?
      var clip = this.calculateClip(entityOne, entityTwo)

      */

      entityOne.velx = 0
      entityOne.vely = 0
      entityTwo.velx = 0
      entityTwo.vely = 0
    },
    calculateIntersectionBetween: function(one, two) {
      var x = 0, y = 0

      // Did the right of 'one' brush into the left of 'two'?
      if(one.lastx + one.width < two.lastx)
        x = two.x - (one.x + one.width) 

      // Did the left of 'one' brush into the right of 'two'?
      else if(one.lastx > two.lastx + two.width)
        x = (two.x + two.width) - one.x

      // Did the bottom of 'one' brush into the 'top' of 'two'?
      if(one.lasty + one.height < two.lasty)
        y = two.y - (one.y + one.height) 

      // Did the top of 'one' brush into the 'bottom' of 'two'?
      else if(one.lasty > two.lasty + two.height)
        y = (two.y + two.height) - one.y

      this.currentIntersection.x = x
      this.currentIntersection.y = y
      return this.currentIntersection
    },
    calculateClip: function(one, two) {
      var intersectResult = {}

      // Clip right
      if(one.x + one.width > two.x && 
         one.x + one.width < two.x + two.width &&
         one.y + (one.height / 2.0) > two.y &&
         one.y + (one.height / 2.0) < two.y + two.height) {
          
        intersectResult.x = two.x - (one.x + one.width); 
        return intersectResult;     
      }
     
      // Clip left
      if(one.x > two.x && 
         one.x < two.x + two.width &&
         one.y + (one.height / 2.0) > two.y &&
         one.y + (one.height / 2.0) < two.y + two.height) {
          
        intersectResult.x = (two.x + two.width) - one.x
        return intersectResult;     
      }

      // Clip bottom
      if(one.x + (one.width / 2.0) > two.x && 
         one.x + (one.width / 2.0) < two.x + two.width &&
         one.y + one.height > two.y &&
         one.y + one.height < two.y + two.height) {

        intersectResult.y =  two.y - (one.y + one.height);
        return intersectResult;     
      }

      // Clip top
      if(one.x + (one.width / 2.0) > two.x && 
         one.x + (one.width / 2.0) < two.x + two.width &&
         one.y + one.height > two.y &&
         one.y + one.height < two.y + two.height) {

        intersectResult.y =  two.y - (one.y + one.height);
        return intersectResult;     
      }


    }
  }

  return RigidBody

})
