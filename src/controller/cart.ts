import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../models/product'
import { database } from '../utils/database'
import { ProductModel, UserWithCart } from '../types/models'

export type PostItemToCart = Request<unknown, unknown, { id: string }>

export const getCartPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const db = database.getDB()

    let products: ProductModel[] = []

    if (db && req.user) {
        const user = await db
            .collection('users')
            .findOne<UserWithCart | null>({ _id: new ObjectId(req.user._id) })
        if (user) {
            // products = user.cart.items
            products = []
        }
    }

    res.render('shop/cart', {
        title: 'Your Shopping Cart | Shops!',
        path: 'shop-cart',
        products: products || [],
        totalPrice: 0
    })
    // }
}

export const addItemToCart = async (
    req: PostItemToCart,
    res: Response
): Promise<void> => {
    const prodId = req.body.id
    const product = await Product.fetchProduct(prodId)
    if (req.user && product) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await req.user.addToCart(product)
    }
    res.redirect('/cart')
}

// export const deleteItemFromCart = async (
//     req: PostItemToCart,
//     res: Response
// ): Promise<void> => {
//     const result = await Cart.deleteProduct(req.body.uuid)
//     if (result) {
//         res.status(500).send(result)
//     }
//     res.redirect('/cart')
// }
