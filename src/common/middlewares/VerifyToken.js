const jwt       = require('jsonwebtoken')
    , config    = require('../config')

/**
 * parse token from request headers (x-access-token)
 * validate and verify token
 * respond with error message or continue
 * @param {Express$Request} req
 * @param {Express$Response} res
 * @param {function} next
 */
function verifyToken(req, res, next) {
  // parse toke from request headers.
  const token = req.headers['x-access-token']

  // validate token.
  if (false === !!token) {
    // handle validation error.
    return res.status(403).json({
      success: false,
      message: 'no token provided'
    })
  }

  // verify token.
  jwt.verify(token, config.secret, (err, decoded) => {
    // handle verify error.
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'failed to authenticate token'
      })
    }

    // add user id to request object.
    req.userId = decoded.id

    // call next (express callback).
    next()
  })
}

module.exports = verifyToken
