module.exports = {
  valueOrDefault: function(value, def) {
    return typeof value !== 'undefined' ? 
         value : 
         def
  }
}
