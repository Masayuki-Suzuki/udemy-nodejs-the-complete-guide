import { Request, Response } from 'express'
import Cart from '../models/cart'
import Product from '../models/product'

export type PostItemToCart = Request<
    unknown,
    unknown,
    {
        productId: string
    }
>

export const getCartPage = (req: Request, res: Response): void => {
    res.render('shop/cart', {
        title: 'Your Shopping Cart | Shops!',
        path: 'shop-cart'
    })
}

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

export const getIndexPage = (req: Request, res: Response): void => {
    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products: Product.getProducts()
    })
}

export const addItemToCart = async (
    req: PostItemToCart,
    res: Response
): Promise<void> => {
    const productId = req.body.productId
    const product = await Product.getProduct(productId)
    Cart.addProduct(product)

    res.redirect('/cart')
}
