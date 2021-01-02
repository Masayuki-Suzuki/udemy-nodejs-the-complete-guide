import fs from 'fs'
import path from 'path'
import { rootPath } from '../utils/rootPath'
import { ProductType } from './product'

export type CartData = {
    products: ProductType[]
    totalPrice: number
}

const filePath = path.join(rootPath, 'data', 'cart.json')

export default class Cart {
    static addProduct(product: ProductType): void {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, fileContent) => {
            let cart: CartData = { products: [], totalPrice: 0 }

            if (!err) {
                cart = JSON.parse(fileContent) as CartData
            }

            let existingProductIndex = 0
            let existingProduct: ProductType | null = null

            if (cart.products.length) {
                existingProductIndex = cart.products.findIndex(
                    prod => prod.uuid === product.uuid
                )
                existingProduct = cart.products[existingProductIndex]
            }

            let updatedProduct: { qty?: number } & ProductType

            if (existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty = updatedProduct.qty
                    ? updatedProduct.qty + 1
                    : 1
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = {
                    ...product,
                    qty: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + product.price

            fs.writeFile(filePath, JSON.stringify(cart), err => {
                console.error(err)
            })
        })
    }
}
