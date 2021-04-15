import { Request, Response } from 'express'
import Stripe from 'stripe'
import Product from '../models/product'
import { RequestWithCustomSession } from '../types/express'
import { ProductModel } from '../types/models'
import currencyFormatter from '../utils/currencyFormatter'

export type PostItemToCart = Request<unknown, unknown, { id: string }>

const stripe = new Stripe(process.env.STRIPE_TEST_KEY as string, {
    apiVersion: '2020-08-27'
})

const isProductItems = (val: any[]): val is ProductModel[] => {
    if (
        Array.isArray(val) &&
        val.length > 0 &&
        '_id' in val[0].productId &&
        'title' in val[0].productId
    ) {
        return true
    }
    return false
}

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

        if (isProductItems(items)) {
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
        }
    } else {
        res.render('shop/cart', {
            title: 'Your Shopping Cart | Shops!',
            path: 'shop-cart',
            products: [],
            totalPrice: 0
        })
    }
}

export const getCheckoutPage = async (
    req: Request,
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

        const currentHost = req.get('host') as string
        const root = `${req.protocol}://${currentHost}`
        const line_items = items.map(prod => {
            if (isProductItem(prod.productId)) {
                return {
                    name: prod.productId.title,
                    description: prod.productId.description,
                    amount: prod.productId.price * 100,
                    currency: 'usd',
                    quantity: prod.quantity
                }
            } else {
                return {
                    name: '',
                    description: '',
                    amount: 0,
                    currency: '',
                    quantity: 0
                }
            }
        })

        const session = await stripe.checkout.sessions
            .create({
                payment_method_types: ['card'],
                line_items,
                success_url: `${root}/cart/checkout/success`,
                cancel_url: `${root}/cart/checkout/cancel`
            })
            .catch(err => {
                console.error(err)
            })

        if (session && session.id) {
            res.render('shop/checkout', {
                title: 'Check Out | Shops!',
                path: 'shop-checkout',
                products: items,
                totalPrice,
                totalPriceFine: currencyFormatter(totalPrice),
                sessionId: session.id
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
