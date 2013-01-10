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
      var entityTwoPerentage = 0
      if(this.weight > other.weight) {
        entityOnePercentage = this.weight / other.weight
        entityTwoPerentage = 1.0 - entityOnePercentage
      }
      else if(this.weight < other.weight) {
        entityTwoPerentage = other.weight / this.weight
        entityOnePercentage = 1.0 - entityTwoPerentage
      }
      else {
        entityOnePercentage = 0.5
        entityTwoPerentage = 0.5
      }

      // Perform ray intersection test
      // with circles? (does this work?)
      // this will give us the angle and position of intersection
      // and from this we'll be able to work out 
      // the angle of bounce, how far to undo the move
      // Perhaps we could do ray intersection between the four corners of one
      // and the sphere of the other, this would be pretty arbitrary of course
      // Perhaps we need to do both for both, then both have their own bouncing 
      // ray, and percentages can be done accordingly
      // can we re-use this code for 'if they're not colliding next frame, did they collide?'
      // Fairly sure we can, that would be neat - entities can't avoid collision
      var intersectionOne = this.calculateIntersectionBetween(entityOne, entityTwo)
      var intersectionTwo = this.calculateIntersectionBetween(entityOne, entityTwo)

      this.resolveIntersectionFor(entityOne, intersectionOne, entityOnePercentage)
      this.resolveIntersectionFor(entityTwo, intersectionTwo, entityTwoPerentage)

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


      entityOne.velx = 0
      entityOne.vely = 0
      entityTwo.velx = 0
      entityTwo.vely = 0
      */
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
