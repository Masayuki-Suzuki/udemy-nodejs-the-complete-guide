import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ProductsSchemaFields = {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    price_fine: {
        type: String,
        required: true
    },
    userId: {
        type: String
    }
}

export default new Schema(ProductsSchemaFields)
