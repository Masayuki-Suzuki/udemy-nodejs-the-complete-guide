export type ProductType = {
    uuid: string
    title: string
    description: string
    image_url: string
    price: number
    price_fine: string
    qty?: number
}

export type CartData = {
    products: ProductType[]
    totalPrice: number
}
