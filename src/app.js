const express         = require('express')
    , fs              = require('fs')
    , morgan          = require('morgan')
    , path            = require('path')
    , config          = require('../config')
    , db              = require('./common/db')
    , ApiController   = require('./routes/api')

const accessLogStream = fs.createWriteStream(config.ACCESS_LOG, { flags: 'a' })
const app = express()
const isProduction = process.env.NODE_ENV === 'development'
const port = process.env.PORT || 3000

false === !!isProduction && app.use(morgan('dev'))
true === !!isProduction && app.use(morgan('combined', { stream: accessLogStream }))
app.use('/api', ApiController)
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
