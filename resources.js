define(function(require) {
  var TextureResource = require('./textureresource')

  var Resources = function() {
    this.cache = {}
    this.waitingForCount = 0
  }

  Resources.prototype = {
    image: function(path) {
      var resource = this.cache[path]
      if(!resource) {
        resource = new TextureResource(path)
        this.cache[path] = resource
        this.registerLoadingResource(resource)
      }
      return resource
    },
    registerLoadingResource: function(resource) {
      this.waitingForCount++
      resource.once('loaded', function() {
        this.waitingForCount--
      }, this)
    }
  }

  return Resources
})
