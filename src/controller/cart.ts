import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Product } from '../models/product'
import { database } from '../utils/database'
import { ProductModel, UserWithCart } from '../types/models'

export type PostItemToCart = Request<unknown, unknown, { id: string }>

export const getCartPage = (req: Request, res: Response): void => {
    if (req.user) {
        req.user
            .getCart()
            .then(products => {
                res.render('shop/cart', {
                    title: 'Your Shopping Cart | Shops!',
                    path: 'shop-cart',
                    products: products || [],
                    totalPrice: 0
                })
            })
            .catch(err => {
                console.error(err)
                res.render('shop/cart', {
                    title: 'Your Shopping Cart | Shops!',
                    path: 'shop-cart',
                    products: [],
                    totalPrice: 0
                })
            })
    }
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

export const deleteItemFromCart = (
    req: PostItemToCart,
    res: Response
): void => {
    console.log('===============')
    console.log(req.body.id)

    if (req.user) {
        req.user
            .deleteOne(req.body.id)
            .then(result => {
                console.info(result)
                res.redirect('/cart')
            })
            .catch(err => {
                console.error(err)
                res.redirect('/cart')
            })
    }
    res.redirect('/cart')
}
