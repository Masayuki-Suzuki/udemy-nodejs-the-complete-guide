import { Request, Response } from 'express'
import Product from '../models/product'

export const getCartPage = (req: Request, res: Response) => {
    res.render('shop/cart', {
        title: 'Your Shopping Cart | Shops!',
        path: 'shop-cart'
    })
}

export const getCheckoutPage = (req: Request, res: Response) => {
    res.render('shop/checkout', {
        title: 'Check Out | Shops!',
        path: 'shop-checkout'
    })
}

export const getOrdersPage = (req: Request, res: Response) => {
    res.render('shop/orders', {
        title: 'Your Orders | Shops!',
        path: 'shop-orders'
    })
}

export const getProductDetailPage = (req: Request, res: Response) => {
    console.log(Product.getProduct(req.params.productId))
    const product = Product.getProduct(req.params.productId)
    res.render('shop/product-detail', {
        title: 'Product Detail | Shops!',
        path: 'shop-product-detail',
        product
    })
}

export const getIndexPage = (req: Request, res: Response) => {
    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products: Product.getProducts()
    })
}
