import { BuildOptions, Model } from 'sequelize'

export type ProductType = {
    uuid: string
    title: string
    description: string
    image_url: string
    price: number
    price_fine: string
    qty?: number
}

export type ProductModel = ProductType & Model
export type ProductModelStrict = typeof Model & {
    new (value?: unknown, options?: BuildOptions): ProductModel
}

export type CartData = {
    products: ProductType[]
    totalPrice: number
}
