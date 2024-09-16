import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    setupDate: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    
}, { timestamps: true })

const Job = mongoose.model('jobs', JobSchema)

export default Job