define(function(require) {
  var Eventable = require('eventable')
  var _ = require('underscore')
  var Layer = require('./layer')
  var Camera = require('./camera')
  var LevelLoader = require('./levelloader')

  var Runner = function(targetid) {
    Eventable.call(this)
    this.targetid = targetid
    this.entities = []
    this.layers = []
    this.canvas = document.getElementById(this.targetid)
    this.context = this.canvas.getContext('2d')
    this.camera = new Camera(this.context)
    this.camera.makeTopLeftWorldCoords(0,0)
  }

  Runner.prototype = {
    start: function() {
      this.raise('init')
      setInterval(_.bind(this.tick, this), 1000/30)
    },
    loadLevel: function(path) {
      var loader = new LevelLoader(path)
      loader.on('finished', this.onLevelLoaded, this)
    },
    setLevel: function(level) {
      this.entities = []
      var i = 0
      for(i = 0; i < level.entities.length; i++)
        this.spawnEntity(level.entities[i].type, level.entities[i].data)
      for(i = 0 ; i < level.layers.length; i++) {
        this.layers.push(new Layer(this, level, i))
      }
    },
    onLevelLoaded: function(level) {
      this.setLevel(level)
    },
    spawnEntity: function(Type, data)  {
      var entity = new Type('entity-' + this.entities.length, data)
      this.entities.push(entity)
      return entity
    },
    tick: function() {
      this.raise('tick')
      for(var i = 0; i < this.entities.length; i++)
        this.entities[i].tick()
      this.render()
    },
    render: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.camera.begin()
      var i = 0
      for(i = 0; i < this.layers.length; i++)
        this.layers[i].render(this.context)

      for(i = 0; i < this.entities.length ; i++) {
        this.entities[i].render(this.context)
      }

      this.camera.end()
    }
  }
  _.extend(Runner.prototype, Eventable.prototype)

  return Runner
})
