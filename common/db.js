const config      = require('./config')
    , mongoose    = require('mongoose')

mongoose.connect(config.db_connect)
