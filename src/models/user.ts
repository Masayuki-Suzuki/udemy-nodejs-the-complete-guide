import { model, Document } from 'mongoose'
import { ObjectId } from 'mongodb'
import { database } from '../utils/database'
import {
    Cart,
    CartItem,
    CartItemModel,
    OrdersModel,
    ProductModel,
    UserModel,
    UserType,
    UserWithCart
} from '../types/models'
import { ID } from '../types/utilities'
import UserSchema from '../Schemas/User'

UserSchema.methods.addToCart = function (product: ProductModel) {
    const cartProductIndex = this.cart.items.findIndex(
        cp => cp.productId.toString() === product._id.toString()
    )

    const updatedCarItems = [...this.cart.items]
    let newQuantity = 1

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCarItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCarItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }

    this.cart = { items: updatedCarItems }
    void this.save()
}

export default model<UserWithCart & Document>('User', UserSchema)

export class User {
    _id: string
    first_name: string
    last_name: string
    email: string
    role: 'admin' | 'customer'

    constructor(params: UserType & { _id?: string }) {
        this.first_name = params.first_name
        this.last_name = params.last_name
        this.email = params.email
        this.role = params.role
        this._id = params._id || ''
    }

    static async findById(id: string): Promise<UserModel | null | undefined> {
        const db = database.getDB()
        if (db) {
            return await db
                .collection('users')
                .findOne<UserModel>({ _id: new ObjectId(id) })
        }
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

    async deleteOne(id: string): Promise<void> {
        const db = database.getDB()
        if (db) {
            const user = await db.collection('users').findOne<UserWithCart>({
                _id: new ObjectId(this._id)
            })

            if (user) {
                const updatedCartItems = user.cart.items.filter(item => {
                    return item.productId.toString() !== id.toString()
                })

                await db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: updatedCartItems } } }
                    )
            }
        }
    }

    async addToCart(product: ProductModel): Promise<void> {
        const db = database.getDB()

        if (db) {
            const user = await db.collection('users').findOne<UserWithCart>({
                _id: new ObjectId(this._id)
            })

            if (user) {
                let cartProductIndex = -1

                let updatedCarItems: CartItemModel[] = []
                let newQuantity = 1

                if (user.cart && user.cart.items) {
                    cartProductIndex = user.cart.items.findIndex(
                        cp => cp.productId.toString() === product._id.toString()
                    )

                    updatedCarItems = [...user.cart.items]

                    if (cartProductIndex >= 0) {
                        newQuantity =
                            user.cart.items[cartProductIndex].quantity + 1
                        updatedCarItems[cartProductIndex].quantity = newQuantity
                    } else {
                        updatedCarItems.push({
                            productId: new ObjectId(product._id),
                            quantity: newQuantity
                        })
                    }
                } else {
                    updatedCarItems.push({
                        productId: new ObjectId(product._id),
                        quantity: 1
                    })
                }

                const updatedCart: Cart = { items: updatedCarItems }

                await db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: updatedCart } }
                    )
            }
        }
    }

    async getCart(): Promise<CartItem[]> {
        const db = database.getDB()

        if (db) {
            let productIds: ID[] = []
            const quantities: number[] = []

            const user = await db.collection('users').findOne<UserWithCart>({
                _id: new ObjectId(this._id)
            })

            if (user) {
                productIds = user.cart.items.map(
                    (item): ID => {
                        quantities.push(item.quantity)
                        return item.productId
                    }
                )
            } else {
                return []
            }

            const items = await db
                .collection('products')
                .find<ProductModel>({
                    _id: { $in: productIds }
                })
                .toArray()

            return items.map((item, index) => {
                return { ...item, quantity: quantities[index] }
            })
        }

        return []
    }

    async addOrder(): Promise<void> {
        const db = database.getDB()
        if (db) {
            const user = await db.collection('users').findOne<UserWithCart>({
                _id: new ObjectId(this._id)
            })

            if (user) {
                this.getCart()
                    .then(async products => {
                        const order = {
                            items: products,
                            user: {
                                _id: new ObjectId(user._id),
                                first_name: user.first_name,
                                last_name: user.last_name
                            }
                        }

                        await db.collection('orders').insertOne(order)
                    })
                    .catch(err => console.error(err))

                await db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { items: [] } } }
                    )
            }
        }
    }

    async getOrders(): Promise<OrdersModel[]> {
        const db = database.getDB()
        if (db) {
            const orders = await db
                .collection('orders')
                .find<OrdersModel>({
                    'user._id': new ObjectId(this._id)
                })
                .toArray()

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return orders || []
        } else {
            return []
        }
    }
}
