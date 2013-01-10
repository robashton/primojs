define(function(require) {
  var _ = require('underscore')
  var Eventable = require('eventable')

  var Input = function(ele) {
    Eventable.call(this)
    document.addEventListener('keydown', _.bind(this.onKeyDown, this))
    document.addEventListener('keyup', _.bind(this.onKeyUp, this))
    this.aliases = {}
    this.states = {}
  }

  Input.prototype = {
    bind: function(keycode, alias) {
      this.aliases[keycode] = alias
    },
    onKeyDown: function(e) {
      var alias = this.aliases[e.keyCode]
      if(alias)
        this.states[alias] = true
    },
    onKeyUp: function(e) {
      var alias = this.aliases[e.keyCode]
      if(alias)
        this.states[alias] = false
    },
    active: function(alias) {
      return !!this.states[alias]
    },
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
  }

  _.extend(Input.prototype, Eventable.prototype)

  return Input
})
