import express from 'express'
import { getTent, getTentByCategory, getTents, updateTentPart } from '../controllers/Tent.js'

const router = express.Router()

router.get('/', getTents)
router.get('/:id', getTent)

//get tent by category
router.get('/category/:category', getTentByCategory)

//update tent part
router.put('/:id/updatePart', updateTentPart)

export default router