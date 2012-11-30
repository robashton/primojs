define(function(require) {
  var Eventable = require('eventable')
  var _ = require('underscore')

  var Runner = function(targetid) {
    Eventable.call(this)
    this.targetid = targetid
  }

  Runner.prototype = {
    start: function() {

    }
  }

  _.extend(Runner.prototype, Eventable.prototype)

  return Runner
})
