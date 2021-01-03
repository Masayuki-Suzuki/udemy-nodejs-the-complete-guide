import { Request, Response } from 'express'
import product, { ProductType } from '../models/product'

type PostProductRequest = Request<unknown, unknown, ProductType>
type PostDeleteProductReq = Request<unknown, unknown, { uuid: string }>

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

export const postAddProduct = (
    req: PostProductRequest,
    res: Response
): void => {
    product.saveProduct(req.body)
    res.redirect('/admin/products')
}

export const postEditProduct = (
    req: PostProductRequest,
    res: Response
): void => {
    product.saveProduct(req.body)
    res.redirect('/admin/products')
}

export const postDeleteProduct = async (
    req: PostDeleteProductReq,
    res: Response
): Promise<void> => {
    const result = await product.deleteProduct(req.body.uuid)
    if (result) {
        res.status(500).send(result)
    } else {
        res.redirect('/admin/products')
    }
}

export default {
    getAddProductPage,
    getEditProductPage,
    getProductPage,
    postAddProduct,
    postEditProduct,
    postDeleteProduct
}
