define(function(require) {
  var Eventable = require('eventable')
  var _ = require('underscore')

  var LevelLoader = function(path) {
    Eventable.call(this)
    this.path = path
    this.constructedLevel = { 
      layers: [],
      entities: []
    }
    this.entityTypes = {}
    this.level = null
    this.pendingResults = 0
    this.finished = false
    this.load()
  }

  LevelLoader.prototype = {
    load: function() {
      $.getJSON(this.path, _.bind(this.onLevelReceived, this))
    },
    onLevelReceived: function(level) {
      this.level = level
      this.loadLayers()
      this.loadEntities()
      this.finished = true
      this.tryFinish()
    },
    loadLayers: function() {
      for(var i = 0 ; i < this.level.layers.length; i++) 
        this.loadLayer(i)
    },
    loadLayer: function(i) {
      var layer = this.level.layers[i]
      this.require(layer.tileset, function(tileset) {
        layer.tileset = tileset
      })
    },
    loadEntities: function() {
      for(var key in this.level.entityTypes)  {
        this.loadEntity(key)
      }
    },
    loadEntity: function(key) {
      var self = this
      var path = this.level.entityTypes[key]
      this.require(path, function(type) {
        self.entityTypes[key] = type
      })
    },
    require: function(dep, callback) {
      var self = this
      this.pendingResults++
      require([dep], function(res) {
         callback(res)
         self.pendingResults--
         self.tryFinish()
      })
    },
    tryFinish: function() {
      if(this.pendingResults === 0 && this.finished) {
        this.mapEntityTypes()
        this.raise('finished', this.level)
      }
    },
    mapEntityTypes: function() {
      for(var i = 0; i < this.level.entities.length; i++) {
        var entity = this.level.entities[i]
        var type = this.entityTypes[entity.type]
        entity.type = type
      }
    }
  }

  _.extend(LevelLoader.prototype, Eventable.prototype)

  return LevelLoader
})
