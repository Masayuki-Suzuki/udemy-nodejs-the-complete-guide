import { Request, Response } from 'express'
import { PostDeleteProductReq, PostProductRequest } from '../types/controllers'
import { Product } from '../models/product'

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
    const product = await Product.fetchProduct(req.params.productId)

    if (!edit || !product) {
        res.redirect('/admin/products')
    }

    res.render('./admin/edit-product', {
        title: 'Edit Product',
        path: 'edit-product',
        pageTitle: 'Edit Product',
        product,
        editMode: edit
    })
}

export const getProductPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = await Product.fetchAll()

    res.render('./admin/products', {
        title: 'Product List',
        path: 'products',
        pageTitle: 'Products',
        products: result
    })
}

export const postAddProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const product = new Product(req.body)
    await product.create()

    res.redirect('/admin/products')
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const product = new Product(req.body)
    const result = await product.update(req.body._id)

    console.info(result)

    res.redirect('/admin/products')
}

export const postDeleteProduct = async (
    req: PostDeleteProductReq,
    res: Response
): Promise<void> => {
    const result = await Product.delete(req.body.id)

    console.info(result)

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
