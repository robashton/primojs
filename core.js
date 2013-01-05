define(function(require) {
  var Eventable = require('eventable')
  var _ = require('underscore')
  var Camera = require('./camera')
  var Level = require('./level')
  var Input = require('./input')

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
  }

  Runner.prototype = {
    start: function() {
      this.raise('init')
      setInterval(_.bind(this.tick, this), 1000/30)
    },
    loadLevel: function(path) {
      this.level = new Level(path)
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
      this.layers = []
    },
    spawnEntity: function(Type, data)  {
      var entity = new Type('entity-' + this.entities.length, data, this)
      this.entities.push(entity)
      return entity
    },
    addLayer: function(layer) {
      this.layers.push(layer)
    },
    tick: function() {
      this.raise('tick')
      for(var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i]
        entity.checkAgainstLevel(this.level)
        entity.tick()
      }
      this.render()
    },
    renderLayer: function(layer) {
      layer.render(this.context)
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
    }
  }
  _.extend(Runner.prototype, Eventable.prototype)

  return Runner
})
