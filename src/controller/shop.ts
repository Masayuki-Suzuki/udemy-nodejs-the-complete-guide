import { Request, Response } from 'express'
import product from '../models/product'

export const getCartPage = (req: Request, res: Response) => {
    res.render('shop/cart', {
        title: 'Your Shopping Cart | Shops!'
    })
}

export const getIndexPage = (req: Request, res: Response) => {
    res.render('index', {
        title: 'Shops!',
        products: product.getProduct()
    })
}
