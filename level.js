define(function(require) {
  var Eventable = require('eventable')
  var _ = require('underscore')
  var $ = require('jquery')
  var Layer = require('./layer')
  var SpriteMap = require('./spritemap')

  var Level = function(path) {
    Eventable.call(this)
    this.path = path
    this.rawdata = null
    this.tilesets = {}
    this.spritemaps = {}
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
    spritemap: function(name) {
      return this.spritemaps[name]
    },
    load: function() {
      $.getJSON(this.path, _.bind(this.onLevelReceived, this))
    },
    worldToTile: function(world) {
      return Math.floor(world / this.rawdata.tilesize)
    },
    checkQuadMovement: function(x, y, width, height, velx, vely) {
      var steps = Math.ceil(Math.max(Math.abs(velx), Math.abs(vely)) / this.rawdata.tilesize)
      var horizontalx = velx > 0 ? x + width : x
      var verticaly = vely > 0 ? y+height : y
      var stepx = velx / steps
      var stepy = vely / steps
      var res = {}

      for(var i = 0 ; i < steps ; i++) {
        var offsetx = stepx * i
        var offsety = stepy * i

        // Check horizontal
        if(this.solidAt(horizontalx + offsetx, y + offsety))
          res.horizontal = true

        if(this.solidAt(horizontalx + offsetx, y+height+offsety))
          res.horizontal = true

        // Check vertical
        if(this.solidAt(x + offsetx, verticaly + offsety))
          res.vertical = true

        if(this.solidAt(x+width+offsetx, verticaly+offsety))
          res.vertical = true
      }
      return res
    },
    solidAt: function(worldx, worldy) {
      var tilex = parseInt(worldx / this.rawdata.tilesize , 10)
      var tiley = parseInt(worldy / this.rawdata.tilesize , 10)
      if(tilex < 0) return false
      if(tiley < 0) return false
      if(tilex >= this.width()) return false
      if(tiley >= this.height()) return false
      for(var i = 0 ; i < this.layers.length; i++) {
        var layer = this.layers[i]
        if(layer.iscollision() && layer.solidAt(tilex, tiley)) return true
      }
      return false
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
      var spritemaps = this.spritemaps
      var collisionmaps = this.collisionmaps
      var tilesize = this.tilesize()
      this.require(layer.tileset, function(tileset) {
        tilesets[layer.tileset] = tileset
        spritemaps[layer.tileset] = new SpriteMap(tileset)
        spritemaps[layer.tileset].generateCollisionMaps(tilesize, tilesize)
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
