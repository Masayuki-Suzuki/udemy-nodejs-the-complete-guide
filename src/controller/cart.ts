import { Request, Response } from 'express'
import Product from '../models/product'
import { RequestWithCustomSession } from '../types/express'
import { ProductModel } from '../types/models'
import currencyFormatter from '../utils/currencyFormatter'

export type PostItemToCart = Request<unknown, unknown, { id: string }>

// eslint-disable-next-line
const isProductItem = (val: any): val is ProductModel => {
    if (typeof val === 'object' && '_id' in val && 'title' in val) {
        return true
    }
    return false
}

export const getCartPage = async (
    req: RequestWithCustomSession,
    res: Response
): Promise<void> => {
    if (req.user) {
        const {
            cart: { items }
        } = await req.user.populate('cart.items.productId').execPopulate()

        let totalPrice = 0

        items.forEach(item => {
            if (isProductItem(item.productId)) {
                totalPrice += item.quantity * item.productId.price
            }
        })

        res.render('shop/cart', {
            title: 'Your Shopping Cart | Shops!',
            path: 'shop-cart',
            products: items,
            totalPrice,
            totalPriceFine: currencyFormatter(totalPrice)
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
        await req.user.addToCart(product)
    }
    res.redirect('/cart')
}

export const deleteItemFromCart = (
    req: PostItemToCart,
    res: Response
): void => {
    if (req.user && req.user.removeCartItem) {
        void req.user.removeCartItem(req.body.id)
        res.redirect('/cart')
    } else {
        res.redirect('/cart')
    }
}
