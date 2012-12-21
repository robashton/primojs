define(function(require) {
  var Eventable = require('eventable')
  var _ = require('underscore')
  var $ = require('jquery')
  var Layer = require('./layer')

  var Level = function(path) {
    Eventable.call(this)
    this.path = path
    this.rawdata = null
    this.tilesets = {}
    this.entityTypes = {}
    this.pendingResults = 0
    this.finished = false
    this.load()
  }

  Level.prototype = {
    load: function() {
      $.getJSON(this.path, _.bind(this.onLevelReceived, this))
    },
    onLevelReceived: function(rawdata) {
      this.rawdata = rawdata
      this.tilesets = {}
      this.entityTypes = {}
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
      var tilesets = this.loadeddata
      this.require(layer.tileset, function(tileset) {
        tilesets[layer.tileset] = tileset
      })
    },
    loadEntities: function() {
      for(var key in this.level.entityTypes)  {
        this.loadEntity(key)
      }
    },
    loadEntity: function(key) {
      var path = this.level.entityTypes[key]
      var entities = this.entitiesTypes
      this.require(path, function(type) {
        entities[key] = type
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
        this.raise('finished')
      }
    },
    loadIntoGame: function(game) {
      game.reset()
      var i = 0

      for(i = 0; i < this.rawdata.entities.length; i++) {
        game.spawnEntity(
          this.rawdata.entities[i].type, 
          this.rawdata.level.entities[i].data)
      }

      for(i = 0 ; i < this.rawdata.layers.length; i++) {
        game.addLayer(new Layer(this, i))
      }
    }
  }

  _.extend(Level.prototype, Eventable.prototype)

  return Level
})
