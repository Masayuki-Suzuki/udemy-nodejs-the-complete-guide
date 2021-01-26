import mongoose from 'mongoose'
import ProductSchema from '../Schemas/Product'
import { ProductType } from '../types/models'

export default mongoose.model<ProductType & mongoose.Document>(
    'Product',
    ProductSchema
)
