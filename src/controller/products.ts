import { Request, Response } from 'express'
import product, { ProductType } from '../models/product'

type PostAddProductRequest = Request<unknown, unknown, ProductType>

export const getAddProductPage = (req: Request, res: Response): void => {
    res.render('./admin/edit-product', {
        title: 'Add Product',
        path: 'add-product',
        pageTitle: 'Add Product'
    })
}

export const getEditProductPage = (req: Request, res: Response): void => {
    const edit = req.query.edit === 'true'
    const productData = product.getProduct(req.params.productId)

    if (!edit || !productData) {
        res.redirect('/admin/products')
    }

    res.render('./admin/edit-product', {
        title: 'Edit Product',
        path: 'edit-product',
        pageTitle: 'Edit Product',
        product: productData,
        editMode: edit
    })
}

export const getProductPage = (req: Request, res: Response): void => {
    res.render('./admin/products', {
        title: 'Product List',
        path: 'products',
        pageTitle: 'Products',
        products: product.getProducts()
    })
}

export const postAddProduct = (req: PostAddProductRequest, res: Response) => {
    product.addProduct(req.body)
    res.redirect('/admin/products')
}

export default {
    getAddProductPage,
    getEditProductPage,
    getProductPage,
    postAddProduct
}
