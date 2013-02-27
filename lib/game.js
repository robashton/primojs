var Eventable = require('primo-events')
var Timer = require('primo-timer')

var _ = require('underscore')

var Scene = require('./scene')
var Resources = require('./resources')
var Input = require('./input')

var Game = function(targetId) {
  Eventable.call(this)
  this.targetid = targetId
  this.desiredFps = 30
  this.cellsize = 32
  this.gravity = function() {}
  this.frameTime = 1 / this.desiredFps
  this.tickTimer = new Timer(this.desiredFps)
  this.tick = _.bind(this.tick, this)
  this.canvas = document.getElementById(this.targetid)
  this.context = this.canvas.getContext('2d')
  this.scene = new Scene(this)
  this.resources = new Resources()
  this.input = new Input(this.canvas)
}

Game.prototype = {
  reset: function() {
    this.scene.reset()
    this.tickTimer.clearSchedule()
  },
  start: function() {
    this.raise('init')
    setInterval(_.bind(this.doTick, this), this.frameTime * 1000)
  },
  doTick: function() {
    this.tickTimer.tick(this.tick)
    this.render()
  },
  tick: function() {
    this.raise('PreTick', this.frameTime) 
    this.scene.tick(this.frameTime)
    this.raise('PostTick', this.frameTime) 
  },
  render: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.scene.render(this.context)
  },
  scheduleEvent: function(ev, ms) {
    this.tickTimer.schedule(ev, ms)
  }
}

_.extend(Game.prototype, Eventable.prototype)

module.exports = Game
