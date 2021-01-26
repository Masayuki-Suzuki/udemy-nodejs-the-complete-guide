import { Request, Response } from 'express'
import Product from '../models/product'
import { ProductModel } from '../types/models'

export const getCheckoutPage = (req: Request, res: Response): void => {
    res.render('shop/checkout', {
        title: 'Check Out | Shops!',
        path: 'shop-checkout'
    })
}

export const getOrdersPage = (req: Request, res: Response): void => {
    if (req.user) {
        // req.user
        //     .getOrders()
        //     .then(orders => {
        //         res.render('shop/orders', {
        //             title: 'Your Orders | Shops!',
        //             path: 'shop-orders',
        //             orders
        //         })
        //     })
        //     .catch(err => {
        //         console.error(err)
        //         res.render('shop/orders', {
        //             title: 'Your Orders | Shops!',
        //             path: 'shop-orders',
        //             orders: []
        //         })
        //     })
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
        product: (await Product.findById(req.params.productId)) as ProductModel
    })
}

export const getIndexPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const products = (await Product.find()) as ProductModel[]

    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products
    })
}

export const postOrder = (req: Request, res: Response): void => {
    if (req.user) {
        // await req.user.addOrder().catch(err => {
        //     console.error(err)
        //     res.redirect('/cart')
        // })
        res.redirect('/orders')
    }
}
