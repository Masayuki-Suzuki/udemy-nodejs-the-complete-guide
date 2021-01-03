import { Request, Response } from 'express'
import Product from '../models/product'

export const getCheckoutPage = (req: Request, res: Response): void => {
    res.render('shop/checkout', {
        title: 'Check Out | Shops!',
        path: 'shop-checkout'
    })
}

export const getOrdersPage = (req: Request, res: Response): void => {
    res.render('shop/orders', {
        title: 'Your Orders | Shops!',
        path: 'shop-orders'
    })
}

export const getProductDetailPage = (req: Request, res: Response): void => {
    res.render('shop/product-detail', {
        title: 'Product Detail | Shops!',
        path: 'shop-product-detail',
        product: Product.getProduct(req.params.productId)
    })
}

export const getIndexPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products: await Product.getProducts()
    })
}
