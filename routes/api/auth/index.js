// AuthController.js
const express       = require('express')
    , bcrypt        = require('bcryptjs')
    , bodyParser    = require('body-parser')
    , jwt           = require('jsonwebtoken')
    , config        = require('../../../common/config')
    , Users         = require('../../../model/Users')
    , VerifyToken   = require('../../../common/middlewares/VerifyToken')

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

/**
 * [POST] '/register'
 * create and persist a new user object.
 * respond with freshly minted token and user id.
 */
router.post('/register', function(req, res) {
  // parse request body.
  const {
    user,
    email,
    password
  } = req.body

  // create a hashed password.
  const hashedPassword = bcrypt.hashSync(password, 8)

  // persist user then respond with token.
  Users.create({
    user,
    email,
    password: hashedPassword
  }).then(user => {
    // respond with user id and freshly minted token.
    const response = tokenResponse({ id: user._id })
    res.status(200).json(response)
  }).catch(err => {
    // handle persist error.
    res.status(500).json({
      success: false,
      message: 'there was a problem registering the user'
    })
  })
})

/**
 * [POST] /signin
 * authenticate a user with email and password.
 * respond with freshly minted token and user id.
 */
router.post('/signin', (req, res) => {
  // parse request body.
  const {
    email,
    password
  } = req.body

  // validate email.
  if (false === !!email)
    return res.status(422).json('email failed validation')

  // validate password.
  if (false === !!password)
    return res.status(422).json('password failed validation')

  // fetch user from data store then respond.
  Users.findOne({ email }).then(user => {
    // handle user not found.
    if (false === !!user) {
      return res.status(404).json({
        success: false,
        message: 'user not found'
      })
    }

    // handle authentication failure.
    if (false === bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        success: 'false',
        message: 'authentication failed'
      })
    }

    // respond with a freshly minted token and user id.
    const response = tokenResponse({ id: user._id })
    res.status(200).json(response)
  }).catch(err => {
    // handle fetch error.
    res.status(500).json({
      success: false,
      message: 'failed to authenticate user'
    })
  })
})

/**
 * [GET] '/me'
 * use middleware to verify access token.
 * fetch user by id provided from verified token.
 * respond with user id and freshly minted token.
 */
router.get('/me', VerifyToken, function(req, res) {
  // fetch user by id.
  Users.findById(req.userId, { password: 0 }).then(user => {
    // handle user not found.
    if (false === !!user) {
      return res.status(404).send('user not found')
    }

    // define id from user object.
    const { id } = user

    // define response object.
    const response = tokenResponse({ id })

    // respond.
    res.status(200).json(response)
  }).catch(err => {
    // handle database failure.
    res.status(500).json({
      success: false,
      message: 'failed to fetch user'
    })
  })
})

/**
 * [HELPER]
 * token response factory.
 * @param {object} obj 
 */
function tokenResponse(obj) {
  // generate (sign) token with arguments object.
  const token = jwt.sign(obj, config.secret, {
    expiresIn: 86400
  })

  // return arguments object composed with token.
  return Object.assign({}, obj, { token })
}

module.exports = router
