const express = require('express')
    , db = require('./common/db')
    , ApiController = require('./routes/api')

const app = express()
const port = process.env.PORT || 3000

app.use('/api', ApiController)
app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})
