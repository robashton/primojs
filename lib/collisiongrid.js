var _ = require('underscore')

var Bucket = function(id) {
  this.id = id
  this.entities = []
}


Bucket.prototype = {
  add: function(entity) {
    this.entities.push(entity)
  },
  count: function() {
    return this.entities.length
  },
  get: function(i) {
    return this.entities[i]
  }
}

var RegisteredEntity = function(entity) {
  this.id = entity.id
  this.entity = entity
  this.buckets = []
}

RegisteredEntity.prototype = {
  addBucket: function(bucket) {
    this.buckets.push(bucket)
  },
  fillArrayWithNearbyEntities: function(array) {
    var added = {}
    for(var i = 0 ; i < this.buckets.length; i++) {
      var bucket = this.buckets[i]
      for(var j = 0; j < bucket.count(); j++) {
        var entity = bucket.get(j)
        if(added[entity.id]) continue
        if(entity.id === this.id) continue
        added[entity.id] = true
        array.push(entity)
      }
    }
  },
  collideWith: function(other) {
    this.entity.handlePotentialCollisionWith(other.entity)
    other.entity.handlePotentialCollisionWith(this.entity)
  }
}

var CollisionGrid = function(cellsize) {
  this.cellsize = cellsize
  this.entities = []
  this.entityBuckets = {}
  this.buckets = []
}

CollisionGrid.prototype = {
  addEntity: function(entity) {
    var registered = new RegisteredEntity(entity)

    for(var x = entity.x ; x <= entity.x + entity.width + this.cellsize ; x += this.cellsize) {
      for(var y = entity.y ; y <= entity.y + entity.height + this.cellsize ; y += this.cellsize) {
        this.addToBucket(registered, x, y)
      }
    }

    this.entities.push(registered)
  },
  addToBucket: function(entity, x, y) {
    var bucket = this.bucketFor(x,y)
    if(!bucket) {
      return
    }
    bucket.add(entity)
    entity.addBucket(bucket)
  },
  bucketFor: function(x,y) {
    x = Math.floor(x / this.cellsize)
    y = Math.floor(y / this.cellsize)
    var id = x + '-' + y
    var bucket = this.buckets[id] 
    if(!bucket) {
      bucket = new Bucket(id)
      this.buckets[id] = bucket
    }
    return bucket
  },
  performCollisionChecks: function() {
    var total = 0
    var entitiesToCheck = []
    for(var i = 0; i < this.entities.length; i++) {
      entitiesToCheck.length = 0
      var registered = this.entities[i]
      registered.fillArrayWithNearbyEntities(entitiesToCheck)
      total += entitiesToCheck.length
      for(var j = 0; j < entitiesToCheck.length; j++) {
        var other = entitiesToCheck[j]
        registered.collideWith(other)
      }
    }
  }
}

module.exports = CollisionGrid

