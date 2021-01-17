import { BuildOptions, Model } from 'sequelize'

export type ProductType = {
    _id: string
    title: string
    description: string
    image_url: string
    price: number
    price_fine: string
}

export type ProductModel = ProductType & {
    _id: string
}
export type ProductModelStrict = typeof Model & {
    new (value?: unknown, options?: BuildOptions): ProductModel
}

export type User = {
    id?: number
    uuid: string
    first_name: string
    last_name: string
    email: string
}

export type UserModel = User & Model
export type UserModelStrict = typeof Model & {
    new (value?: unknown, options?: BuildOptions): UserModel
}

export type CartData = {
    products: ProductType[]
    totalPrice: number
}
