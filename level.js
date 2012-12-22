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
    width: function() {
      return this.rawdata.width
    },
    height: function() {
      return this.rawdata.height
    },
    tilesize: function() {
      return this.rawdata.tilesize
    },
    layerdata: function(index) {
      return this.rawdata.layers[index]
    },
    tileset: function(name) {
      return this.tilesets[name]
    },
    load: function() {
      $.getJSON(this.path, _.bind(this.onLevelReceived, this))
    },
    layerCount: function() {
      return this.data.layers.length
    },
    onLevelReceived: function(rawdata) {
      this.rawdata = rawdata
      this.tilesets = {}
      this.entityTypes = {}
      this.layers = []
      this.loadLayers()
      this.loadEntities()
      this.finished = true
      this.tryFinish()
    },
    loadLayers: function() {
      for(var i = 0 ; i < this.rawdata.layers.length; i++) 
        this.loadLayer(i)
    },
    addLayer: function(data) {
      var i = this.rawdata.layers.length
      this.rawdata.layers.push(data)
      this.layers.push(new Layer(this, i))
      this.loadLayer(i)
    },
    loadLayer: function(i) {
      var layer = this.rawdata.layers[i]
      var tilesets = this.tilesets
      this.require(layer.tileset, function(tileset) {
        tilesets[layer.tileset] = tileset
      })
    },
    loadEntities: function() {
      for(var key in this.rawdata.entityTypes)  {
        this.loadEntity(key)
      }
    },
    loadEntity: function(key) {
      var path = this.rawdata.entityTypes[key]
      var entities = this.entityTypes
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
        this.createLayers()
        this.raise('loaded')
      }
    },
    createLayers: function() {
      for(var i = 0 ; i < this.rawdata.layers.length; i++) {
        this.layers[i] = new Layer(this, i)
      }
    },
    forEachLayer: function(cb) {
      for(var i = 0 ; i < this.layers.length; i++) {
        cb(this.layers[i])
      }
    },
    loadIntoGame: function(game) {
      game.reset()
      var i = 0
      for(i = 0; i < this.rawdata.entities.length; i++) {
        var config = this.rawdata.entities[i]
        var type = this.entityTypes[config.type]
        game.spawnEntity(type, config.data)
      }
    },
    indexForWorldCoords: function(x, y) {
      var tilex = Math.floor(x / this.rawdata.tilesize)
      var tiley = Math.floor(y / this.rawdata.tilesize)
      var index = tilex + tiley * this.rawdata.width
      return index
    },
    setTileAt: function(layer, x, y, tile) {
      var index = this.indexForWorldCoords(x, y)
      this.rawdata.layers[layer].data[index] = tile
    },
    getTileAt: function(layer, x, y, tile) {
      var index = this.indexForWorldCoords(x, y)
      return this.rawdata.layers[layer].data[index] 
    }
  }

  _.extend(Level.prototype, Eventable.prototype)

  return Level
})
