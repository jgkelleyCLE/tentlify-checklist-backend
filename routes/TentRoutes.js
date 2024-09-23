import express from 'express'
import { fetchTents, getTent, getTentByCategory, getTents, updateTentPart } from '../controllers/Tent.js'

const router = express.Router()

//"new" fetch tents route
router.get('/fetch', fetchTents)

router.get('/', getTents)
router.get('/:id', getTent)

//get tent by category
router.get('/category/:category', getTentByCategory)

//update tent part
router.put('/:id/updatePart', updateTentPart)



export default router