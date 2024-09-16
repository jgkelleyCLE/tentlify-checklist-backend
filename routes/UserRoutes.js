import express from 'express'
import { addTentToFavorites, editUser, getUser, getUserFavorites, getUsers, removeTentFromFavorites } from '../controllers/Users.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

//get all users
router.get('/', auth, getUsers)

//add tent to favorites
router.post('/favorite', auth, addTentToFavorites)

router.delete('/favorite', auth, removeTentFromFavorites)

//get user favorites
router.get('/favorites', auth, getUserFavorites)

//edit user profile
router.put('/edit', auth, editUser)

//get user
router.get('/:id', getUser)

export default router