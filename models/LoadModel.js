import mongoose from 'mongoose'


const loadSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: false
    },
    users: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ],
    tents: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'MutatedTent' //this allows the 'tent' to be populated with the 'MutatedTent' model
        }
    ],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true
    },
    orderId: { type: String, required: false, unique: true }, 
    eventDate: {
        type: String,
        required: false
    },
    loadType: {
        type: Number,
        required: false,
        default: 1
    }
}, { timestamps: true })

const Load = mongoose.model('Load', loadSchema)

export default Load