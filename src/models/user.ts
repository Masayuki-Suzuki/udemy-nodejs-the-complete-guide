import { ObjectId } from 'mongodb'
import { database } from '../utils/database'
import { Cart, ProductModel, UserModel, UserType } from '../types/models'

export class User {
    readonly _id: string
    readonly first_name: string
    readonly last_name: string
    readonly email: string
    readonly role: 'admin' | 'customer'
    private cart: Cart

    constructor(params: UserType & { _id?: string }) {
        this.first_name = params.first_name
        this.last_name = params.last_name
        this.email = params.email
        this.role = params.role
        this._id = params._id || ''
        this.cart = { items: [] }
    }

    async create(): Promise<string> {
        const db = database.getDB()
        let errorMessage = ''

        if (db) {
            const collection = db.collection('users')
            const userExisted = await collection.findOne<UserModel>({
                email: this.email
            })

            const { first_name, last_name, email, role } = this

            if (collection && !userExisted) {
                await collection
                    .insertOne({
                        first_name,
                        last_name,
                        email,
                        role
                    })
                    .catch(err => {
                        console.error(err)
                        errorMessage = 'ERROR: Failed to create new user.'
                    })
                console.info('Created new user')
            } else {
                if (userExisted) {
                    errorMessage = 'Email address has already taken.'
                } else {
                    errorMessage = 'Database: users collection was not found.'
                }
            }
        } else {
            errorMessage = 'Data source not found.'
        }

        return errorMessage || 'Success'
    }

    static async findById(id: string): Promise<UserModel | null | undefined> {
        const db = database.getDB()
        if (db) {
            return await db
                .collection('users')
                .findOne<UserModel>({ _id: new ObjectId(id) })
        }
    }

    async addToCart(product: ProductModel): Promise<void> {
        const cartProductIndex = this.cart.items.findIndex(
            cp => cp.productId === product._id.toString()
        )

        let newQuantity = 1
        const updatedCarItems = [...this.cart.items]

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1
            updatedCarItems[cartProductIndex].quantity = newQuantity
        } else {
            updatedCarItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            })
        }

        const updatedCart: Cart = { items: updatedCarItems }
        const db = database.getDB()

        if (db) {
            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(this._id) },
                // eslint-disable-next-line
                { $set: { cart: updatedCart } }
            )

            console.info(result)
        }
    }
}
