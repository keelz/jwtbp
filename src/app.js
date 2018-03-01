import express from 'express'
import fs from 'fs'
import morgan from 'morgan'
import config from '../config'
import { mlabConnect } from './common/db'
import ApiController from './routes/api'

mlabConnect()

const accessLogStream = fs.createWriteStream(config.ACCESS_LOG, { flags: 'a' })
const app = express()
const isProduction = process.env.NODE_ENV === 'production'
const listenCallback = x => console.log(`server is running on port ${x}`)
const port = process.env.PORT || 3000

false === !!isProduction && app.use(morgan('dev'))
true === !!isProduction && app.use(morgan('combined', { stream: accessLogStream }))
app.use('/api', ApiController)
app.listen(port, listenCallback(port))
