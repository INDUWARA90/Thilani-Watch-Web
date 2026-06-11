function asyncHandler(handler) {
  return function (req, res, next) {
    try {
      const result = handler(req, res, next)

      if (result && typeof result.then === "function") {
        result.catch(function (error) {
          next(error)
        })
      }

    } catch (error) {
      next(error)
    }
  }
}

module.exports = asyncHandler
