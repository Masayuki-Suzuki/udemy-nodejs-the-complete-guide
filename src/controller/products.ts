import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import products from '../models/product'
import { PostDeleteProductReq, PostProductRequest } from '../types/controllers'
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
    const productData = await products.findOne({
        where: { uuid: req.params.productId }
    })

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
        products: await products.findAll()
    })
}

export const postAddProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const product = req.body
    product.price_fine = currencyFormatter(product.price)
    product.uuid = uuidV4()

    if (req.body.user && req.body.user.id) {
        product.userId = req.body.user.id
    }

    delete product.user

    const result = await products.create(product).catch(err => {
        console.error(err)
        res.status(500)
    })

    console.info(result)

    res.redirect('/admin/products')
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const target = await products.findOne({
        where: { uuid: req.body.uuid }
    })

    if (target) {
        target.title = req.body.title
        target.description = req.body.description
        target.image_url = req.body.image_url
        target.price = req.body.price
        target.price_fine = currencyFormatter(req.body.price)

        await target.save().catch(err => {
            console.error(err)
            res.status(500).send(
                `Internal Server Error: DB couldn't save the data.`
            )
        })
    }
    res.redirect('/admin/products')
}

export const postDeleteProduct = async (
    req: PostDeleteProductReq,
    res: Response
): Promise<void> => {
    const target = await products.findOne({
        where: { uuid: req.body.uuid }
    })

    if (target) {
        await target.destroy()
    }
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
