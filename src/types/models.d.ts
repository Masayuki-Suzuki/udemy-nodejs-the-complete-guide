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

export type Cart = {
    items: CartItem[]
}
