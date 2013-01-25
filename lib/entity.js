var _ = require('underscore') 
var util = require('primo-utils')
var Eventable = require('primo-events')

var Entity = function(id,data, scene) {
  Eventable.call(this)
  this.id = id
  data = data || {}
  this.x = util.valueOrDefault(data.x, 0)
  this.y = util.valueOrDefault(data.y, 0)
  this.rotation = 0
  this.lastx = this.x
  this.lasty = this.y
  this.velx = util.valueOrDefault(data.velx, 0)
  this.vely = util.valueOrDefault(data.vely, 0)
  this.rotvel = util.valueOrDefault(data.rotvel, 0)
  this.width = util.valueOrDefault(data.width, 0)
  this.height = util.valueOrDefault(data.height, 0)
  this.collideable = false
  this.gravible = false
  this.scene = scene
  this.game = scene.game
  this.components = []
  this.commandHandlers = {}
  this.dispatch = _.bind(this.dispatch, this)
}

Entity.prototype = {
  getComponentOfType: function(Type) {
    _(this.components).find(function(c) { return c instanceof Type})
  },
  attach: function(component) {
    this.components.push(component)
    return component
  },
  tick: function(frameTime) {
    this.raise('tick', frameTime)
    _(this.components).each(function(c) { if(c.tick) c.tick(frameTime) })
    this.checkAgainstLevel()
  },
  render: function(context) {
    _(this.components).each(function(c) { if(c.render) c.render(context) })
  },
  handle: function(command, cb) {
    this.commandHandlers[command] = cb
  },
  dispatch: function(command, data) {
    var handler = this.commandHandlers[command]
    if(!handler)
      console.warn('No handler registered for command', command)
    else
      handler(data)
  },
  applyPhysics: function(frameTime) {
    this.game.applyGravityTo(this)
    this.lastx = this.x
    this.lasty = this.y
    this.x += this.velx * frameTime
    this.y += this.vely * frameTime
    this.rotation += this.rotvel * frameTime
    this.game.applyGravityTo(this)
  },
  checkAgainstLevel: function() {
    if(!this.scene.level) return
    var level = this.scene.level

    var res = level.checkQuadMovement(
      this.x, this.y, this.width, this.height, 
      this.velx * this.frameTime, this.vely * this.frameTime)

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
  },
  kill: function() {
    this.raise('killed')
    this.scene.removeEntity(this)
  }
}

Entity.Define = function(init, methods) {
  var Ctor = function(id, data, game) {
    Entity.call(this, id, data, game)
    init.call(this, id, data)
  }
  _.extend(Ctor.prototype, Entity.prototype)
  if(methods)
    _.extend(Ctor.prototype, methods)
  return Ctor
}
_.extend(Entity.prototype, Eventable.prototype)

module.exports = Entity
