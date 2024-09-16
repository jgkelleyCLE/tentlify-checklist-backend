import Job from "../models/JobModel.js";



//POST JOB
export const postJob = async(req, res) => {
    
    try {
        
        const newJob = await Job.create({ ...req.body, userId: req.user.id })
        res.status(201).json(newJob)

    } catch (error) {
        res.status(400).json({ message: error.message })    
    }

    

}

//GET ALL JOBS
export const getJobs = async(req, res) => {
    try {
        
        const jobs = await Job.find()
        res.status(200).json(jobs)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


//GET JOB
export const getJob = async(req, res) => {
    const id = req.params.id

    console.log("ID FROM SINGLE JOB: ", id)

    try {
        const job = await Job.findById(id)

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }

}

//GET USER JOBS
export const getUserJobs = async(req, res) => {
    try {
        const userJobs = await Job.find({ userId: req.user.id })
        res.status(200).json(userJobs)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}



//DELETE JOB
export const deleteJob = async(req, res) => {
    const id = req.params.id

try {
    const job = await Job.findByIdAndDelete(id)
    res.status(200).json(job)
} catch (error) {
    res.status(400).json({ message: error.message })    
}

}