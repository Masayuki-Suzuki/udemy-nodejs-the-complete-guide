import path from 'path'
import fs from 'fs'
import { rootPath } from '../utils/rootPath'
import currencyFormatter from '../utils/currencyFormatter'

export type ProductType = {
    title: string
    description: string
    price: number | string
}

export class Product {
    private filePath = path.join(rootPath, 'data', 'products.json')
    private products: ProductType[] = []

    getProduct(): ProductType[] {
        fs.readFile(
            this.filePath,
            { encoding: 'utf-8' },
            (err, fileContent) => {
                if (err) {
                    this.products = []
                } else {
                    this.products = JSON.parse(fileContent) as ProductType[]
                }
            }
        )

        return this.products
    }

    addProduct(product: ProductType) {
        fs.readFile(
            this.filePath,
            { encoding: 'utf-8' },
            (err, fileContent) => {
                if (!err) {
                    this.products = JSON.parse(fileContent) as ProductType[]
                }

                product.price = currencyFormatter(
                    parseInt(product.price as string, 10)
                )

                this.products.push(product)
                fs.writeFile(
                    this.filePath,
                    JSON.stringify(this.products),
                    err => {
                        console.error(err)
                    }
                )
            }
        )
    }
}

export default new Product()
