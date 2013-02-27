var _ = require('underscore')
var Eventable = require('primo-events')
var Camera = require('primo-camera')

var Scene = function(game) {
  Eventable.call(this)
  this.entities = []
  this.layers = []
  this.game = game
  this.context = this.game.context
  this.camera = new Camera(this.context)
  this.camera.makeTopLeftWorldCoords(0,0)
  this.gravityObject = {x: 0, y: 0}
}

Scene.prototype = {
  tick: function(frameTime) {
    for(var i = 0; i < this.entities.length; i++) { 
      var entity = this.entities[i] 
      entity.tick(frameTime)
      entity.applyPhysics(frameTime)
    }
  },
  applyGravityTo: function(entity) {
    if(!entity.gravible) return
    this.gravityObject.x = 0
    this.gravityObject.y = 0
    this.game.gravity(entity, this.gravityObject)
    entity.velx += this.gravityObject.x
    entity.vely += this.gravityObject.y
  },
  render: function(context) {
    this.camera.begin()
    this.raise('pre-render', this.context)
    try {
      this.forEachVisibleEntity(function(entity) {
        entity.render(context)
      })
    }
    catch(ex) {
      console.log("problem rendering scene", ex)
    }
    finally {
      this.raise('post-render', this.context)
      this.camera.end()
    }
  },
  reset: function() {
    this.entities = []
    this.clearListeners()
    this.layers = []
  },
  findEntityById: function(id) {
    return _.find(this.entities, function(entity) { return entity.id === id })
  },
  spawnEntity: function(Type, data)  {
    var entity = new Type('entity-' + this.entities.length, data, this)
    this.entities.push(entity)
    entity.addProxy(this)
    return entity
  },
  forEachEntity: function(cb) {
    for(var i = 0; i < this.entities.length; i++) {
      cb(this.entities[i])
    }
  },
  forEachVisibleEntity: function(cb) {
    var camera = this.camera
    this.forEachEntity(function(entity) {
      if(camera.isVisible(entity.x, entity.y, entity.width, entity.height)) cb(entity)
    })
  },
  removeEntity: function(entity) {
    entity.removeProxy(this)
    this.entities = _.without(this.entities, entity)
  },
  addLayer: function(layer) {
    this.layers.push(layer)
  },
  entityAt: function(worldx, worldy) {
    for(var i = 0; i < this.entities.length; i++) {
      var entity = this.entities[i]
      if(entity.x > worldx) continue
      if(entity.y > worldy) continue
      if(entity.x + entity.width < worldx) continue
      if(entity.y + entity.height < worldy) continue
      return entity
    }
    return null
  },
  renderLayer: function(layer) {
    layer.render(this.context)
  },
}
_.extend(Scene.prototype, Eventable.prototype)

module.exports = Scene

