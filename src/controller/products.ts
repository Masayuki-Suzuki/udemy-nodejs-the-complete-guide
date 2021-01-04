import { Request, Response } from 'express'
import product from '../models/product'
import { PostDeleteProductReq, PostProductRequest } from '../types/controllers'

export const getAddProductPage = (req: Request, res: Response): void => {
    res.render('./admin/edit-product', {
        title: 'Add Product',
        path: 'add-product',
        pageTitle: 'Add Product'
    })
}

export const getEditProductPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const edit = req.query.edit === 'true'
    const productData = await product.getProduct(req.params.productId)

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

export const getProductPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('./admin/products', {
        title: 'Product List',
        path: 'products',
        pageTitle: 'Products',
        products: await product.getProducts()
    })
}

export const postAddProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    await product.saveProduct(req.body)
    res.redirect('/admin/products')
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    await product.saveProduct(req.body)
    res.redirect('/admin/products')
}

export const postDeleteProduct = async (
    req: PostDeleteProductReq,
    res: Response
): Promise<void> => {
    await product.deleteProduct(req.body.uuid)
    res.redirect('/admin/products')
}

export default {
    getAddProductPage,
    getEditProductPage,
    getProductPage,
    postAddProduct,
    postEditProduct,
    postDeleteProduct
}
