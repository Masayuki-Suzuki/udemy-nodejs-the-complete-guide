import { CreateQuery, Document } from 'mongoose'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { PostDeleteProductReq, PostProductRequest } from '../types/controllers'
import Product from '../models/product'
import { ProductModel, ProductType } from '../types/models'
import currencyFormatter from '../utils/currencyFormatter'

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
    const product = (await Product.findById(
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
    const products = (await Product.find()) as ProductModel[]

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
    const errors = validationResult(req as Request)

    if (req.session.user && errors.isEmpty()) {
        const doc = {
            title: req.body.title,
            description: req.body.description,
            image_url: req.body.image_url,
            price: req.body.price,
            price_fine: currencyFormatter(req.body.price),
            userId: req.session.user
        }
        await Product.create(doc)
        res.redirect('/admin/products')
    } else {
        const errorMessages = {
            title: '',
            description: '',
            imageURL: '',
            price: ''
        }

        errors.array().find(err => {
            errorMessages[err.param] = err.msg
        })

        console.log(errorMessages)

        res.render('./admin/edit-product', {
            title: 'Add Product',
            path: 'edit-product',
            pageTitle: 'Add Product',
            product: req.body,
            edit: false,
            errors: errors.array()
        })
        // res.redirect('/')
    }
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    if (req.session.user) {
        const product = (await Product.findById(req.body._id)) as ProductModel &
            Document
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
    await Product.findByIdAndRemove(req.body.id)
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
