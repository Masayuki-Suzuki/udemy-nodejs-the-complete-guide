import { Response } from 'express'
import { Document } from 'mongoose'
import Product from '../models/product'
import { RequestWithUserModel } from '../types/express'
import {
    CartItem,
    OrderItem,
    OrdersModel,
    ProductModel,
    UserWithCart
} from '../types/models'
import Order from '../Schemas/Order'

export type PostItemToCart = RequestWithUserModel<{ id: string }>

export const getCartPage = async (
    req: RequestWithUserModel,
    res: Response
): Promise<void> => {
    if (req.user) {
        const {
            cart: { items }
        } = await req.user.populate('cart.items.productId').execPopulate()

        res.render('shop/cart', {
            title: 'Your Shopping Cart | Shops!',
            path: 'shop-cart',
            products: items,
            totalPrice: 0
        })
    } else {
        res.render('shop/cart', {
            title: 'Your Shopping Cart | Shops!',
            path: 'shop-cart',
            products: [],
            totalPrice: 0
        })
    }
}

export const addItemToCart = async (
    req: PostItemToCart,
    res: Response
): Promise<void> => {
    const prodId = req.body.id
    const product = (await Product.findById(prodId)) as ProductModel
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
    if (req.user && req.user.removeCartItem) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        void req.user.removeCartItem(req.body.id)
        res.redirect('/cart')
    } else {
        res.redirect('/cart')
    }
}
