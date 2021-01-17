import { Request, Response } from 'express'
import { Product } from '../models/product'
import { PostProductRequest } from '../types/controllers'

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

export const getProductDetailPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    console.log(req.params.productId)
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
    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products: await Product.fetchAll()
    })
}
