var _ = require('underscore')
var Eventable = require('primo-events')
var Camera = require('primo-camera')

var Level = require('./level')
var CollisionGrid = require('./collisiongrid')

var Scene = function(game) {
  Eventable.call(this)
  this.level = null
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
    var grid = new CollisionGrid(this.game.cellsize) 
    for(var i = 0; i < this.entities.length; i++) { 
      var entity = this.entities[i] 
      entity.tick(frameTime)
      if(entity.collideable) {
        if(this.level)
          entity.checkAgainstLevel(this.level, frameTime)
        grid.addEntity(entity)
      }
      this.applyGravityTo(entity)
      entity.updatePhysics(frameTime)
      this.applyGravityTo(entity)
    }
    grid.performCollisionChecks(frameTime)
  },
  // TODO: Probably put this in a component instead
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
    try {
      if(this.level)
        this.level.forEachLayer(_.bind(this.renderLayer, this))
      for(var i = 0; i < this.entities.length ; i++) {
        this.entities[i].render(this.context)
      }
    }
    catch(ex) {
      console.log("problem rendering scene", ex)
    }
    finally {
      this.camera.end()
    }
  },
  loadLevel: function(path) {
    this.level = new Level(this, path)
    this.level.on('loaded', this.onLevelLoaded, this)
  },
  setLevel: function(level) {
    this.level = level
    this.level.loadIntoScene(this)
  },
  onLevelLoaded: function() {
    this.level.loadIntoScene(this)
  },
  reset: function() {
    this.entities = []
    this.clearListeners()
    this.layers = []
  },
  spawnEntity: function(Type, data)  {
    var entity = new Type('entity-' + this.entities.length, data, this)
    this.entities.push(entity)
    entity.addProxy(this)
    return entity
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

