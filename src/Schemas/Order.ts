import mongoose from 'mongoose'

const Schema = mongoose.Schema

export default new Schema({
    products: [
        {
            product: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: String,
        required: true
    }
})
