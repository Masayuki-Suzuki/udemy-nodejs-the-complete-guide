import { Request, Response } from 'express'
import prisma from '../prisma'
import products from '../models/product'

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
    res.render('shop/product-detail', {
        title: 'Product Detail | Shops!',
        path: 'shop-product-detail',
        product: await products.findOne({
            where: { uuid: req.params.productId }
        })
    })
}

export const getIndexPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products: await prisma.products.findMany()
    })
}
