import fs from 'fs'
import path from 'path'
import { rootPath } from '../utils/rootPath'
import { CartData, ProductType } from '../types/models'

const filePath = path.join(rootPath, 'data', 'cart.json')

export default class Cart {
    static async getCartData(): Promise<CartData | string> {
        const fileContent = await fs.promises
            .readFile(filePath, 'utf-8')
            .catch(err => {
                console.error(err)
                return 'Database accessing failed'
            })
        return JSON.parse(fileContent) as CartData
    }

    static addProduct(product: ProductType): void {
        fs.readFile(filePath, 'utf-8', (err, fileContent) => {
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
                if (err) {
                    console.error(err)
                }
            })
        })
    }

    static async deleteProduct(uuid: string): Promise<string | null> {
        const fileContentJson = await fs.promises
            .readFile(filePath, 'utf-8')
            .catch(err => {
                console.error(err)
                return 'Database Not Found...'
            })

        const fileContent = JSON.parse(fileContentJson) as CartData

        const updatedProducts = fileContent.products.filter(prod => {
            if (prod.uuid === uuid) {
                fileContent.totalPrice -= prod.price * (prod.qty ? prod.qty : 1)
                return false
            }
            return true
        })

        fileContent.products = updatedProducts

        const result = await fs.promises
            .writeFile(filePath, JSON.stringify(fileContent))
            .catch(err => {
                console.error(err)
                return 'Save file failed...'
            })

        return result ? result : null
    }
}
