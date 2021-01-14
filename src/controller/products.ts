import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import prisma from '../prisma'
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
    const product = await prisma.products.findUnique({
        where: { uuid: req.params.productId }
    })

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
    res.render('./admin/products', {
        title: 'Product List',
        path: 'products',
        pageTitle: 'Products',
        products: await prisma.products.findMany()
    })
}

export const postAddProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const product = {
        ...req.body,
        ...{
            price: parseFloat(req.body.price),
            uuid: uuidV4(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }

    product.price_fine = currencyFormatter(product.price)

    if (req.body.user && req.body.user.id) {
        product.userId = req.body.user.id
    }

    const result = await prisma.products.create({ data: product })
    console.info(result)

    res.redirect('/admin/products')
}

export const postEditProduct = async (
    req: PostProductRequest,
    res: Response
): Promise<void> => {
    const result = await prisma.products
        .update({
            where: { uuid: req.body.uuid },
            data: {
                title: req.body.title,
                description: req.body.description,
                image_url: req.body.image_url,
                price: parseFloat(req.body.price),
                price_fine: currencyFormatter(parseFloat(req.body.price))
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send(
                `Internal Server Error: DB couldn't save the data.`
            )
        })

    console.info(result)

    res.redirect('/admin/products')
}

export const postDeleteProduct = async (
    req: PostDeleteProductReq,
    res: Response
): Promise<void> => {
    const result = await prisma.products
        .delete({
            where: { uuid: req.body.uuid }
        })
        .catch(err => {
            console.error(err)
        })

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
