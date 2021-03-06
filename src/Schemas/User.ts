import { Schema, Document } from 'mongoose'
import { UserWithCart } from '../types/models'

const userSchema = new Schema<UserWithCart & Document>({
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
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isSuspended: Boolean,
    isDeleted: Boolean,
    lastLoggedIn: Date,
    createdAt: Date
})

export default userSchema
