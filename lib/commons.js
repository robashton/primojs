define(function(require) {
  return {
    valueOrDefault: function(value, def) {
      return typeof value !== 'undefined' ? 
           value : 
           def
    }
  }
})
