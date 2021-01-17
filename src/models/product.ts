import mongodb from 'mongodb'
import { ProductModel, ProductType } from '../types/models'
import { getDB } from '../utils/database'
import currencyFormatter from '../utils/currencyFormatter'
import { Nullable } from '../types/utilities'
import error from '../controller/error'

// let collection = getDB().collection('products')

export class Product {
    private title: string
    private description: string
    private image_url: string
    private price: number
    private price_fine: string

    constructor(params: ProductType) {
        this.title = params.title
        this.description = params.description
        this.image_url = params.image_url
        this.price = params.price
        this.price_fine = currencyFormatter(params.price)
    }

    public async save(): Promise<string> {
        const collection = getDB().collection('products')
        const { title, description, image_url, price, price_fine } = this

        let errorMessage = ''

        await collection
            .insertOne({
                title,
                description,
                image_url,
                price,
                price_fine
            })
            .catch(err => {
                errorMessage = 'insert data error'
                console.error(errorMessage)
                console.error(err)
            })

        return errorMessage || 'Success'
    }

    public async update(id: string): Promise<string> {
        console.log(id)
        const { title, description, image_url, price, price_fine } = this
        const collection = getDB().collection('products')

        let errorMessage = ''

        await collection
            .updateOne(
                { _id: new mongodb.ObjectId(id) },
                {
                    $set: {
                        title,
                        description,
                        image_url,
                        price,
                        price_fine
                    }
                }
            )
            .catch(err => {
                errorMessage = 'ERROR: update database error.'
                console.error(errorMessage)
                console.error(err)
            })

        return errorMessage || 'Success'
    }

    static async fetchProduct(id: string): Promise<Nullable<ProductModel>> {
        const collection = getDB().collection('products')
        const product = await collection.findOne<ProductModel>({
            _id: new mongodb.ObjectId(id)
        })

        return product
    }

    static async fetchAll(): Promise<ProductModel[]> {
        const collection = getDB().collection('products')
        return (await collection.find().toArray()) as ProductModel[]
    }

    static async delete(id: string): Promise<string> {
        const collection = getDB().collection('products')

        let errorMessage = ''

        await collection
            .deleteOne({
                _id: new mongodb.ObjectId(id)
            })
            .catch(err => {
                errorMessage = 'ERROR: Failed to delete data'
                console.error(errorMessage)
                console.error(err)
            })

        return errorMessage || 'Success'
    }
}
