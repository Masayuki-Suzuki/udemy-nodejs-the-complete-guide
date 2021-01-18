export type ProductType = {
    title: string
    description: string
    image_url: string
    price: number
    price_fine: string
}

export type ProductModel = {
    _id: string
} & ProductType

export type UserType = {
    first_name: string
    last_name: string
    email: string
    role: 'admin' | 'customer'
}

export type UserModel = {
    _id: string
} & UserType
