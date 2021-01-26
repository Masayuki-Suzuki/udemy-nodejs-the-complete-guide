import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'

export type ProductType = {
    title: string
    description: string
    image_url: string
    price: number
    price_fine: string
    userId: string
}

export type ProductModel = {
    _id: string
} & ProductType

export type CartItem = {
    quantity: number
} & ProductModel

export type UserType = {
    first_name: string
    last_name: string
    email: string
    role: 'admin' | 'customer'
}

export type UserModel = {
    _id: string
} & UserType

export type UserWithCart = {
    cart: Cart
} & UserModel

export type DocumentUser = Document &
    UserWithCart & {
        addToCart?: (product: ProductModel) => Promise<void>
        removeCartItem?: (productId: string) => Promise<void>
    }

export type Cart = {
    items: CartItemModel[]
}

export type CartItemModel = {
    productId: string | number | ObjectId
    quantity: number
}

export type OrdersModel = {
    items: CartItem[]
    user: Pick<UserModel, '_id' | 'first_name' | 'last_name'>
}
