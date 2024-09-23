import mongoose from 'mongoose'

const MutatedChairSchema = new mongoose.Schema({
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
                required: true
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

const MutatedChair = mongoose.model('MutatedChair', MutatedChairSchema)

export default MutatedChair
