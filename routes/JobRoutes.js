import express from 'express'
import { deleteJob, getJob, getJobs, getUserJobs, postJob } from '../controllers/Job.js';
import { auth } from '../middleware/auth.js';

const router = express.Router()

//GET ALL JOBS
router.get('/', getJobs)

//GET JOB
router.get('/job/:id', getJob)

//GET USER JOBS
router.get('/user/:id', auth, getUserJobs)

//POST JOB
router.post('/', auth, postJob)

//DELETE JOB
router.delete('/:id', auth, deleteJob)

export default router;