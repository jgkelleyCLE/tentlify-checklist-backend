import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        default: 'https://static.thenounproject.com/png/4154905-200.png'
    },
    image: {
        type: String,
        
    },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tent'
        }
    ],
    
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

export default User