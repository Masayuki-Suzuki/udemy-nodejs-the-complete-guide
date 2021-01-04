import { v4 as uuidV4 } from 'uuid'
import currencyFormatter from '../utils/currencyFormatter'
import { ProductType } from '../types/models'
import db from '../utils/database'

export class Product {
    async getProduct(id: string): Promise<ProductType> {
        const [rows] = await db.execute(
            `SELECT * FROM products WHERE uuid="${id}"`
        )

        return rows[0] as ProductType
    }

    // Get All Products
    async getProducts(): Promise<ProductType[] | string> {
        const [rows] = await db.execute('SELECT * FROM products').catch(err => {
            console.error(err)
            return [err as unknown, null]
        })

        return rows as ProductType[]
    }

    async saveProduct(product: ProductType): Promise<void> {
        const [rows] = (await db.execute(
            `SELECT uuid FROM products WHERE uuid="${product.uuid}"`
        )) as [ProductType[], unknown]
        const existingProductId = rows[0]

        if (existingProductId) {
            await db.execute(
                'UPDATE products SET ' +
                    `title='${product.title}', ` +
                    `description='${product.description}', ` +
                    `image_url='${product.image_url}', ` +
                    `price='${product.price}', ` +
                    `price_fine='${currencyFormatter(product.price)}' ` +
                    `WHERE uuid="${product.uuid}"`
            )
        } else {
            await db.execute(
                'INSERT INTO products ' +
                    '(uuid, title, description, image_url, price, price_fine) ' +
                    `values ('${uuidV4()}', '${product.title}', ` +
                    `'${product.description}', '${product.image_url}', ` +
                    `'${product.price}', '${currencyFormatter(product.price)}')`
            )
        }
    }

    async deleteProduct(uuid: string): Promise<void> {
        await db.execute(`DELETE FROM products WHERE uuid='${uuid}'`)
    }
}

export default new Product()
