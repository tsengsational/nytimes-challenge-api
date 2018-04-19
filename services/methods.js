var methods = {
  martian: function() {

  },
  flatten: function (arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? methods.flatten(toFlatten) : toFlatten);
    }, []);
  }
}

module.exports = methods
