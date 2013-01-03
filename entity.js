define(function(require) {
  var _ = require('underscore')
  var util = require('./commons')

  var Entity = function(id,data) {
    this.id = id
    this.x = util.valueOrDefault(data.x, 0)
    this.y = util.valueOrDefault(data.y, 0)
    this.velx = util.valueOrDefault(data.velx, 0)
    this.vely = util.valueOrDefault(data.vely, 0)
    this.width = util.valueOrDefault(data.width, 0)
    this.height = util.valueOrDefault(data.height, 0)
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
    }
  }

  Entity.Define = function(init) {
    var Ctor = function(id, data) {
      Entity.call(this, id, data)
      init.call(this, id, data)
    }
    _.extend(Ctor.prototype, Entity.prototype)
    return Ctor
  }
  return Entity
})
