import chalk from 'chalk'
import mongoose from 'mongoose'
import constants from './constants'

export const mlabConnect = () => mongoose.connect(constants.db_connect, err => {
  if (err) {
    console.log(chalk.red(`failed to connect to database: ${err.message}`))
    process.exit()
  }
})
