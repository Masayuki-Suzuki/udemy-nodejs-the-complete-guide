import { Request, Response } from 'express'
import MgProduct, { Product } from '../models/product'
import { ProductModel, UserType } from '../types/models'
import { User } from '../models/user'

export const getCheckoutPage = (req: Request, res: Response): void => {
    res.render('shop/checkout', {
        title: 'Check Out | Shops!',
        path: 'shop-checkout'
    })
}

export const getOrdersPage = (req: Request, res: Response): void => {
    if (req.user) {
        req.user
            .getOrders()
            .then(orders => {
                res.render('shop/orders', {
                    title: 'Your Orders | Shops!',
                    path: 'shop-orders',
                    orders
                })
            })
            .catch(err => {
                console.error(err)
                res.render('shop/orders', {
                    title: 'Your Orders | Shops!',
                    path: 'shop-orders',
                    orders: []
                })
            })
    } else {
        res.render('shop/orders', {
            title: 'Your Orders | Shops!',
            path: 'shop-orders',
            orders: []
        })
    }
}

export const getProductDetailPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('shop/product-detail', {
        title: 'Product Detail | Shops!',
        path: 'shop-product-detail',
        product: await Product.fetchProduct(req.params.productId)
    })
}

export const getIndexPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userData: UserType = {
        first_name: 'Masayuki',
        last_name: 'Suzuki',
        email: 'm.suzuki.fp@gmail.com',
        role: 'admin'
    }

    const products = (await MgProduct.find()) as ProductModel[]

    const user = new User(userData)
    await user.create()

    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products
    })
}

export const postOrder = async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
        await req.user.addOrder().catch(err => {
            console.error(err)
            res.redirect('/cart')
        })
        res.redirect('/orders')
    }
}
