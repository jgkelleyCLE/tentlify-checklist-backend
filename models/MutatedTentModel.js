import mongoose from 'mongoose'

const MutatedTentSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    product: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    size: {
        type: Number,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    cartQuantity: {
        type: Number,
        required: false
    },
    images: [
        {
            type: String,
            required: false
        }
    ],
    image: {
        type: String,
        required: false
    },
    schematic: {
        type: String,
        required: false
    },
    parts: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                auto: true
            },
            item: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: false
            },
            completed: {
                type: Boolean,
                required: true,
                default: false
            },
            completedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    
    tags: String
}, { timestamps: true })

const MutatedTent = mongoose.model('MutatedTent', MutatedTentSchema)

export default MutatedTent