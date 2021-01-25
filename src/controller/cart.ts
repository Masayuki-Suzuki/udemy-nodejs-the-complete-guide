import { Request, Response } from 'express'
import { Product } from '../models/product'
import { RequestWithUserModel } from '../types/express'

export type PostItemToCart = RequestWithUserModel<{ id: string }>

export const getCartPage = (req: Request, res: Response): void => {
    // if (req.user) {
    //     req.user
    //         .getCart()
    //         .then(products => {
    //             res.render('shop/cart', {
    //                 title: 'Your Shopping Cart | Shops!',
    //                 path: 'shop-cart',
    //                 products: products || [],
    //                 totalPrice: 0
    //             })
    //         })
    //         .catch(err => {
    //             console.error(err)
    //             res.render('shop/cart', {
    //                 title: 'Your Shopping Cart | Shops!',
    //                 path: 'shop-cart',
    //                 products: [],
    //                 totalPrice: 0
    //             })
    //         })
    // }
    res.render('shop/cart', {
        title: 'Your Shopping Cart | Shops!',
        path: 'shop-cart',
        products: [],
        totalPrice: 0
    })
}

export const addItemToCart = async (
    req: PostItemToCart,
    res: Response
): Promise<void> => {
    const prodId = req.body.id
    const product = await Product.fetchProduct(prodId)
    if (req.user && product && req.user.addToCart) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await req.user.addToCart(product)
    }
    res.redirect('/cart')
}

export const deleteItemFromCart = (
    req: PostItemToCart,
    res: Response
): void => {
    if (req.user) {
        // req.user
        //     .deleteOne(req.body.id)
        //     .then(() => {
        //         res.redirect('/cart')
        //     })
        //     .catch(err => {
        //         console.error(err)
        //         res.redirect('/cart')
        //     })
    } else {
        res.redirect('/cart')
    }
}
