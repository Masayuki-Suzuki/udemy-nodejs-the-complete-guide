import { Document } from 'mongoose'
import { Request, Response } from 'express'
import { PostDeleteProductReq, PostProductRequest } from '../types/controllers'
import MgProduct, { Product } from '../models/product'
import { ProductModel, ProductType } from '../types/models'
import currencyFormatter from '../utils/currencyFormatter'
// import { RequestWithUserModel } from '../types/express'

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
    const product = (await MgProduct.findById(
        req.params.productId
    )) as ProductModel

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
    const products = (await MgProduct.find()) as ProductModel[]

    res.render('./admin/products', {
        title: 'Product List',
        path: 'products',
        pageTitle: 'Products',
        products
    })
}

export const postAddProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    if (req.user) {
        // const params = {
        //     ...req.body,
        //     price_fine: currencyFormatter(req.body.price),
        //     userId: new ObjectId(req.user._id)
        // } as ProductType
        await MgProduct.create({
            title: req.body.title,
            description: req.body.description,
            image_url: req.body.image_url,
            price: req.body.price,
            price_fine: currencyFormatter(req.body.price),
            userId: req.user
        })
        // await mgProduct.save()
        // const product = new Product(params)
        // await product.create()
        res.redirect('/admin/products')
    } else {
        res.redirect('/')
    }
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    if (req.user) {
        const product = (await MgProduct.findById(
            req.body._id
        )) as ProductModel & Document
        product.title = req.body.title
        product.description = req.body.description
        product.image_url = req.body.image_url
        product.price = req.body.price
        product.price_fine = currencyFormatter(req.body.price)
        await product.save()

        res.redirect('/admin/products')
    } else {
        res.redirect('/')
    }
}

export const postDeleteProduct = async (
    req: PostDeleteProductReq,
    res: Response
): Promise<void> => {
    await MgProduct.findByIdAndRemove(req.body.id)
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
