import path from 'path'
import fs from 'fs'
import { v4 as uuidV4 } from 'uuid'
import { rootPath } from '../utils/rootPath'
import currencyFormatter from '../utils/currencyFormatter'

export type ProductType = {
    uuid: string
    title: string
    description: string
    image_url: string
    price: number | string
}

export class Product {
    private filePath = path.join(rootPath, 'data', 'products.json')
    private products: ProductType[] = []

    getProduct(id: string): ProductType {
        return this.products.filter(product => product.uuid === id)[0]
    }

    getProducts(): ProductType[] {
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

                // eslint-disable-next-line
                product.uuid = uuidV4() as string
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
