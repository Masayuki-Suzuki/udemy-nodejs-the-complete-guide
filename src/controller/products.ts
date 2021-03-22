import { Document } from 'mongoose'
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { PostDeleteProductReq, PostProductRequest } from '../types/controllers'
import Product from '../models/product'
import { ProductModel } from '../types/models'
import currencyFormatter from '../utils/currencyFormatter'
import { Nullable } from '../types/utilities'

type AddProductErrorMessage = {
    title: Nullable<string>
    imageURL: Nullable<string>
    price: Nullable<string>
}

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

    const errorMessages: Nullable<AddProductErrorMessage> = {
        title: req.flash('errorMessage-title')[0],
        imageURL: req.flash('errorMessage-imageURL')[0],
        price: req.flash('errorMessage-title')[0]
    }

    if (!edit || !product) {
        res.redirect('/admin/products')
    }

    res.render('./admin/edit-product', {
        title: 'Edit Product',
        path: 'edit-product',
        pageTitle: 'Edit Product',
        product,
        editMode: edit,
        errorMessages
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
            image_url: req.file.path.replace('src/public', ''),
            price: req.body.price,
            price_fine: currencyFormatter(req.body.price),
            userId: req.session.user
        }
        await Product.create(doc)
        res.redirect('/admin/products')
    } else {
        const errorMessages: AddProductErrorMessage = {
            title: null,
            imageURL: null,
            price: null
        }

        errors.array().find(err => {
            if (errorMessages) {
                errorMessages[err.param] = err.msg
            }
        })

        const product = {
            _id: req.body._id,
            title: req.body.title,
            image_url: req.body.image_url,
            description: req.body.description,
            price: req.body.price
        }

        res.render('./admin/edit-product', {
            title: 'Add Product',
            path: 'edit-product',
            pageTitle: 'Add Product',
            edit: false,
            hasError: true,
            product,
            errorMessages
        })
    }
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const errors = validationResult(req as Request)

    if (req.session.user && errors.isEmpty()) {
        const product = (await Product.findById(req.body._id)) as ProductModel &
            Document
        product.title = req.body.title
        product.description = req.body.description
        product.price = req.body.price
        product.price_fine = currencyFormatter(req.body.price)

        if (req.file && req.file.path) {
            product.image_url = req.body.image_url.replace('src/images', '')
        }
        await product.save()

        res.redirect('/admin/products')
    } else {
        errors.array().find(err => {
            req.flash(`errorMessage-${err.param}`, err.msg)
        })

        res.redirect(`/admin/edit-product/${req.body._id}?edit=true`)
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
