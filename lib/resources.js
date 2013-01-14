define(function(require) {
  var SpriteMap = require('./spritemap')
  var TextureResource = require('./textureresource')


  var Resources = function() {
    this.cache = {}
    this.waitingForCount = 0
  }

  Resources.prototype = {
    spritemap: function(path, spritewidth, spriteheight) {
      var image = this.image(path)
      return new SpriteMap(image, spritewidth, spriteheight)
    },
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
