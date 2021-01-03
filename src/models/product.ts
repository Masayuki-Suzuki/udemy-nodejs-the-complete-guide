import path from 'path'
import fs from 'fs'
import { v4 as uuidV4 } from 'uuid'
import { rootPath } from '../utils/rootPath'
import currencyFormatter from '../utils/currencyFormatter'
import { ProductType } from '../types/models'

export class Product {
    private filePath = path.join(rootPath, 'data', 'products.json')
    private products: ProductType[] = []

    constructor() {
        // eslint-disable-next-line
        const _ = this.getProducts()
    }

    async getProduct(id: string): Promise<ProductType> {
        if (!this.products.length) {
            await this.getProducts()
        }

        return this.products.filter(product => product.uuid === id)[0]
    }

    async getProducts(): Promise<ProductType[]> {
        const fileContent = await fs.promises
            .readFile(this.filePath, 'utf-8')
            .catch(err => console.error(err))

        if (fileContent) {
            this.products = JSON.parse(fileContent) as ProductType[]
        }

        return this.products
    }

    saveProduct(product: ProductType): void {
        const existingProductIndex = this.products.findIndex(prod => {
            return prod.uuid === product.uuid
        })

        // When "product" has already existed.
        if (existingProductIndex >= 0) {
            const updatedProducts = [...this.products]
            product.price_fine = currencyFormatter(product.price)
            updatedProducts[existingProductIndex] = product
            fs.writeFile(
                this.filePath,
                JSON.stringify(updatedProducts),
                err => {
                    if (err) {
                        console.error(err)
                    }
                }
            )
        } else {
            fs.readFile(
                this.filePath,
                { encoding: 'utf-8' },
                (err, fileContent) => {
                    if (!err) {
                        this.products = JSON.parse(fileContent) as ProductType[]
                    }

                    // eslint-disable-next-line
                    product.uuid = uuidV4() as string
                    product.price_fine = currencyFormatter(product.price)

                    this.products.push(product)
                    fs.writeFile(
                        this.filePath,
                        JSON.stringify(this.products),
                        err => {
                            if (err) {
                                console.error(err)
                            }
                        }
                    )
                }
            )
        }
    }

    async deleteProduct(uuid: string): Promise<string | null> {
        const existedProduct = this.products.find(prod => prod.uuid === uuid)

        if (existedProduct) {
            const updatedProducts = this.products.filter(
                prod => prod.uuid !== uuid
            )

            this.products = updatedProducts

            await fs.promises
                .writeFile(this.filePath, JSON.stringify(this.products))
                .catch(err => {
                    console.error(err)
                    return 'Save data failed.'
                })

            return null
        } else {
            return 'product Id does not exist.'
        }
    }
}

export default new Product()
