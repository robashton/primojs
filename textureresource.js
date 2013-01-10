define(function(require) {
  var _ = require('underscore')
    , Eventable = require('eventable')

  var TextureResource = function(path) {
    Eventable.call(this)
    this.path = path
    this.loaded = false
    this.image = new Image()
    this.image.src = path
    this.image.onload = _.bind(this.onLoaded, this)
  }

  TextureResource.prototype = {
    get: function() {
      return this.image
    },
    onLoaded: function() {
      this.loaded = true
      this.raise('loaded')
    },
    waitForLoaded: function(cb) {
      if(this.loaded) cb()
      else this.once('loaded', cb)
    }
  }

  _.extend(TextureResource.prototype, Eventable.prototype)

  return TextureResource
})
