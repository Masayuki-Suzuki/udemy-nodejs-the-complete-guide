import { Request, Response } from 'express'
import { Product, ProductType } from '../models/product'

type PostAddProductRequest = Request<unknown, unknown, ProductType>

const product = new Product()

export const getAddProductPage = (req: Request, res: Response): void => {
    res.render('./admin/add-product', {
        title: 'Add Product',
        path: 'add-product',
        pageTitle: 'Add Product'
    })
}

export const getProductPage = (req: Request, res: Response): void => {
    res.render('./admin/products', {
        title: 'Product List',
        path: 'products',
        pageTitle: 'Products',
        products: product.getProduct()
    })
}

export const getDashboardPage = (req: Request, res: Response): void => {
    res.render('./admin/dashboard', {
        title: 'Admin Dashboard',
        path: 'dashboard',
        pageTitle: 'Dashboard'
    })
}

export const redirectToDashboard = (req: Request, res: Response): void => {
    res.redirect('/admin/dashboard')
}

export const postAddProduct = (req: PostAddProductRequest, res: Response) => {
    product.addProduct(req.body)
    res.redirect('/admin/products')
}

export default {
    getAddProductPage,
    getProductPage,
    getDashboardPage,
    redirectToDashboard,
    postAddProduct
}
