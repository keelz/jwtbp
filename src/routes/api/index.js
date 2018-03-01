import express from 'express'
import AuthController from './auth'
import UsersController from './users'

const router = express.Router()
router.use('/auth', AuthController)
router.use('/users', UsersController)

export default router
