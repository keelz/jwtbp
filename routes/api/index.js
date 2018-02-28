const express = require('express')
    , AuthController = require('./auth')
    , UsersController = require('./users')

const router = express.Router()
router.use('/auth', AuthController)
router.use('/users', UsersController)

module.exports = router
