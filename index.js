var Eventable = require('primo-events')
var _ = require('underscore')

// Some of these will be modules
var Camera = require('./lib/camera')
var Level = require('./lib/level')
var Input = require('./lib/input')
var Resources = require('./lib/resources')
var CollisionGrid = require('./lib/collisiongrid')
var Timer = require('./lib/timer')

var Runner = function(targetid) {
  Eventable.call(this)
  this.targetid = targetid
  this.level = null
  this.entities = []
  this.layers = []
  this.canvas = document.getElementById(this.targetid)
  this.context = this.canvas.getContext('2d')
  this.camera = new Camera(this.context)
  this.camera.makeTopLeftWorldCoords(0,0)
  this.input = new Input(this.canvas)
  this.resources = new Resources()
  this.desiredFps = 30
  this.frameTime = 1 / this.desiredFps
  this.tickTimer = new Timer(this.desiredFps)
  this.tick = _.bind(this.tick, this)
}

Runner.prototype = {
  start: function() {
    this.raise('init')
    setInterval(_.bind(this.doTick, this), this.frameTime * 1000)
  },
  loadLevel: function(path) {
    this.level = new Level(this, path)
    this.level.on('loaded', this.onLevelLoaded, this)
  },
  setLevel: function(level) {
    this.level = level
    this.level.loadIntoGame(this)
  },
  onLevelLoaded: function() {
    this.level.loadIntoGame(this)
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
  onEntityEvent: function(ev, data) {
    this.raise(ev, data)
  },
  addLayer: function(layer) {
    this.layers.push(layer)
  },
  doTick: function() {
    this.tickTimer.tick(this.tick)
    this.render()
  },
  tick: function() {
    this.raise('tick') 
    var grid = new CollisionGrid(32) 
    for(var i = 0; i < this.entities.length; i++) { 
      var entity = this.entities[i] 
      entity.tick(this.frameTime)
      if(entity.collideable) {

        // This is pro-active
        if(this.level)
          entity.checkAgainstLevel(this.level, this.frameTime)
        grid.addEntity(entity)
      }
      entity.updatePhysics(this.frameTime)
    }
    // This is re-active
    grid.performCollisionChecks(this.frameTime)
  },
  entityAt: function(worldx, worldy) {
    // TODO: Spacial hash for even this
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
  render: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
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
  renderLayer: function(layer) {
    layer.render(this.context)
  },
}
_.extend(Runner.prototype, Eventable.prototype)

module.exports = Runner

