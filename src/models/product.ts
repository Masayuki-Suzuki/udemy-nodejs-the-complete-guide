import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import ProductSchema from '../Schemas/Product'
import currencyFormatter from '../utils/currencyFormatter'
import { database } from '../utils/database'
import { ProductModel, ProductType } from '../types/models'
import { Nullable } from '../types/utilities'

export default mongoose.model<ProductType & mongoose.Document>(
    'Product',
    ProductSchema
)

export class Product {
    private title: string
    private description: string
    private image_url: string
    private price: number
    private price_fine: string
    private userId: string

    constructor(params: ProductType) {
        this.title = params.title
        this.description = params.description
        this.image_url = params.image_url
        this.price = params.price
        this.price_fine = currencyFormatter(params.price)
        this.userId = params.userId
    }

    public async create(): Promise<string> {
        const db = database.getDB()
        let errorMessage = ''

        if (db) {
            const collection = db.collection('products')
            const {
                title,
                description,
                image_url,
                price,
                price_fine,
                userId
            } = this

            await collection
                .insertOne({
                    title,
                    description,
                    image_url,
                    price,
                    price_fine,
                    userId
                })
                .catch(err => {
                    errorMessage = 'insert data error'
                    console.error(errorMessage)
                    console.error(err)
                })
        } else {
            errorMessage = 'Data source not found.'
        }

        return errorMessage || 'Success'
    }

    public async update(id: string): Promise<string> {
        const db = database.getDB()
        let errorMessage = ''

        if (db) {
            const collection = db.collection('products')
            const {
                title,
                description,
                image_url,
                price,
                price_fine,
                userId
            } = this

            await collection
                .updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            title,
                            description,
                            image_url,
                            price,
                            price_fine,
                            userId
                        }
                    }
                )
                .catch(err => {
                    errorMessage = 'ERROR: update database error.'
                    console.error(errorMessage)
                    console.error(err)
                })
        } else {
            errorMessage = 'Data source not found.'
        }

        return errorMessage || 'Success'
    }

    static async fetchProduct(id: string): Promise<Nullable<ProductModel>> {
        const db = database.getDB()
        if (db) {
            const collection = db.collection('products')
            const product = await collection.findOne<ProductModel>({
                _id: new ObjectId(id)
            })

            return product
        }

        return null
    }

    static async fetchAll(): Promise<ProductModel[]> {
        const db = database.getDB()
        if (db) {
            const collection = db.collection('products')
            return (await collection.find().toArray()) as ProductModel[]
        }

        return []
    }

    static async delete(id: string): Promise<string> {
        const db = database.getDB()
        let errorMessage = ''

        if (db) {
            const collection = db.collection('products')

            await collection
                .deleteOne({
                    _id: new ObjectId(id)
                })
                .catch(err => {
                    errorMessage = 'ERROR: Failed to delete data'
                    console.error(errorMessage)
                    console.error(err)
                })
        } else {
            errorMessage = 'Data source not found.'
        }

        return errorMessage || 'Success'
    }
}
