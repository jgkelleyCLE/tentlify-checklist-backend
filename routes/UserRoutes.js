import express from 'express'
import { getUsers } from '../controllers/Users.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

//get all users
router.get('/', auth, getUsers)

export default router