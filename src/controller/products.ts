import { Request, Response } from 'express'

type Product = {
    product_name: string
}

type PostAddProductRequest = Request<unknown, unknown, Product>

export const products: Product[] = []

export const getAddProductPage = (req: Request, res: Response): void => {
    res.render('./admin/add-product', {
        title: 'Add Product',
        path: 'add-product',
        pageTitle: 'Add Product'
    })
}

export const getProductPage = (req: Request, res: Response): void => {
    res.render('./admin/products', {
        title: 'Products list',
        path: 'products',
        pageTitle: 'Products'
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
    products.push({ product_name: req.body.product_name })
    res.redirect('/admin/products')
}

export default {
    getAddProductPage,
    getProductPage,
    getDashboardPage,
    redirectToDashboard,
    postAddProduct
}
