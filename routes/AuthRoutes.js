import express from 'express'
import { googleSignIn } from '../controllers/Auth.js'

const router = express.Router()

//google sign in
router.post('/google', googleSignIn)

export default router