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
    productId: ProductModel
}

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
        clearCart?: () => Promise<void>
    }

export type Cart = {
    items: CartItemModel[]
}

export type CartItemModel = {
    productId: string | number | ObjectId | { _doc: ProductModel }
    quantity: number
}

export type OrdersModel = {
    products: CartItem[]
    user: Pick<UserModel, '_id' | 'first_name' | 'last_name'>
    createdAt: string
}

export type OrderItem = {
    product: ProductModel
    quantity: number
}

export type OrderProduct = {
    create
} & ProductModel
