import express from 'express'
import { auth } from '../middleware/auth.js'
import { createMutatedTent, updateMutatedTentPart, getMutatedTent } from '../controllers/MutatedTent.js'

const router = express.Router()

//create new mutated tent
router.post('/create/:id', auth, createMutatedTent)

//update mutated tent part
router.put('/:id/updatePart', auth, updateMutatedTentPart)

//get mutated tent
router.get('/:id', getMutatedTent)

export default router