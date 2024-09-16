import express from 'express'
import { auth } from '../middleware/auth.js'
import { createLoad, getLoads, addUserToLoad, removeUserFromLoad, addTentToLoad, removeTentFromLoad, getLoad, updateLoad, getAdminLoads, getUsersLoads, deleteLoad, deactivateLoad, activateLoad } from '../controllers/Load.js'

const router = express.Router()

//get all loads
router.get('/', auth, getLoads)

//get loads involving user
router.get('/user/:userId', auth, getUsersLoads)

//get load
router.get('/load/:id', auth, getLoad)

//get admin loads
router.get('/adminLoads/:id', auth, getAdminLoads)

//create Load
router.post('/', auth, createLoad)

//add user to load
router.put('/:id/addUser', auth, addUserToLoad)

//remove user from load
router.put('/:id/removeUser', auth, removeUserFromLoad)

//add tent to load
router.put('/:id/addTent', auth, addTentToLoad)

//remove tent from load
router.put('/:id/removeTent', auth, removeTentFromLoad)

//update load
router.put('/:id', auth, updateLoad)

//delete Load
router.delete('/:id', auth, deleteLoad)

//deactivateLoad
router.put('/:id/deactivate', auth, deactivateLoad)

//activate load
router.put('/:id/activate', auth, activateLoad)

export default router