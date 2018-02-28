const express = require('express')
    , db = require('./common/db')
    , ApiController = require('./routes/api')

const app = express()
app.use('/api', ApiController)

module.exports = app
