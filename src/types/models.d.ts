import { ObjectId } from 'mongodb'
import { Document } from 'mongoose'
import { Nullable } from './utilities'

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

export type CartItemDoc = {
    quantity: number
    product: ProductType
}

export type UserType = {
    first_name: string
    last_name: string
    email: string
    role: 'supervisor' | 'admin' | 'customer' | 'root'
    password: string
    resetToken?: Nullable<string>
    resetTokenExpiration?: Nullable<number>
    isSuspended: boolean
    isDeleted: boolean
    lastLoggedIn: number
    createdAt: number
}

export type UserTypeForViews = {
    lastLoggedIn: string
} & Omit<UserType, 'lastLoggedIn'>

export type UserModel = {
    _id: string
} & UserType

export type UserWithCart = {
    cart: Cart
} & UserModel

export type DocumentUser = Document &
    UserWithCart & {
        _doc?: UserWithCart
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

export type OrdersDoc = {
    products: CartItemDoc[]
    user: { userId: string } & Pick<UserModel, 'first_name' | 'last_name'>
    createdAt: string
}

export type OrdersModel = {
    products: CartItem[] | CartItemDoc[]
    user: { userId: string } & Pick<UserModel, 'first_name' | 'last_name'>
    createdAt: string
    totalPrice: string
}
