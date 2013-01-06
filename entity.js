define(function(require) {
  var _ = require('underscore')
  var util = require('./commons')

  var Entity = function(id,data, game) {
    this.id = id
    this.x = util.valueOrDefault(data.x, 0)
    this.y = util.valueOrDefault(data.y, 0)
    this.velx = util.valueOrDefault(data.velx, 0)
    this.vely = util.valueOrDefault(data.vely, 0)
    this.width = util.valueOrDefault(data.width, 0)
    this.height = util.valueOrDefault(data.height, 0)
    this.game = game
    this.components = []
  }

  Entity.prototype = {
    attach: function(component) {
      this.components.push(component)
    },
    tick: function() {
      _(this.components).each(function(c) { if(c.tick) c.tick() })
    },
    render: function(context) {
      _(this.components).each(function(c) { if(c.render) c.render(context) })
    },
    updatePhysics: function() {
      this.x += this.velx
      this.y += this.vely
    },
    checkAgainstLevel: function(level) {
      var res = level.checkQuadMovement(
        this.x, this.y, this.width, this.height, this.velx, this.vely)

      if(res.horizontal && res.vertical) {
        this.x = res.x
        this.y = res.y
        this.velx = 0
        this.vely = 0
      }
      else if(res.horizontal) {
        this.vely = 0
        this.y = res.y
      } 
      else if(res.vertical) {
        this.velx = 0
        this.x = res.x
      }
      else if(res.collision) {
        this.x = res.x
        this.y = res.y
        this.velx = 0
        this.vely = 0
      }
    }
  }

  Entity.Define = function(init) {
    var Ctor = function(id, data, game) {
      Entity.call(this, id, data, game)
      init.call(this, id, data)
    }
    _.extend(Ctor.prototype, Entity.prototype)
    return Ctor
  }
  return Entity
})
