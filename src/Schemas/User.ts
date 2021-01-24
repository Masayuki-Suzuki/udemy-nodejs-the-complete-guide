import { Schema } from 'mongoose'

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})

export default userSchema
