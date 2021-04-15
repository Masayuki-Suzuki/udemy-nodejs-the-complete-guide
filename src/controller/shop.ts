import path from 'path'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import pdfkit from 'pdfkit'
import Product from '../models/product'
import { CartItemDoc, OrdersModel, ProductModel } from '../types/models'
import Order from '../models/Order'
import { IndexPageRequest, PostOrderRequest } from '../types/controllers'
import currencyFormatter from '../utils/currencyFormatter'

const ITEMS_PER_PAGE = 9

const isCartItemDoc = (val: any): val is CartItemDoc => {
    return 'product' in val
}

export const getOrdersPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (req.session.user) {
        // eslint-disable-next-line
        const orders = (await Order.find({
            // eslint-disable-next-line
            'user.userId': req.session.user._id
        }).sort({ _id: -1 })) as OrdersModel[]

        res.render('shop/orders', {
            title: 'Your Orders | Shops!',
            path: 'shop-orders',
            orders
        })
    } else {
        res.render('shop/orders', {
            title: 'Your Orders | Shops!',
            path: 'shop-orders',
            orders: []
        })
    }
}

export const getProductDetailPage = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.render('shop/product-detail', {
        title: 'Product Detail | Shops!',
        path: 'shop-product-detail',
        product: (await Product.findById(req.params.productId)) as ProductModel
    })
}

export const getIndexPage = async (
    req: IndexPageRequest,
    res: Response
): Promise<void> => {
    let page = 1

    if (typeof req.query.page === 'string') {
        page = parseInt(req.query.page)
    } else if (req.query.page) {
        page = req.query.page
    }

    const totalProducts = await Product.find().countDocuments()
    const products = (await Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)) as ProductModel[]

    res.render('index', {
        title: 'Shops!',
        path: 'shop-index',
        products,
        currentPage: page,
        lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE)
    })
}

export const getInvoice = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const orderId = req.params.orderId

    const order = await Order.findById(orderId).catch(err => {
        console.error(err)
        next(new Error('No order found.'))
    })

    if (order) {
        if (
            req.user &&
            order.user.userId.toString() !== req.user._id.toString()
        ) {
            next(new Error('Unauthorised.'))
        }
        const invoiceName = `invoice-${orderId}.pdf`
        const invoicePath = path.join(
            'data',
            'invoices',
            order.user.userId.toString(),
            invoiceName
        )

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
            'Content-Disposition',
            `inline; filename="${invoiceName}"`
        )

        const pdfDoc = new pdfkit()
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)
        pdfDoc
            .fillColor('#323232')
            .font('Helvetica-Bold')
            .fontSize(32)
            .text('Invoice')
        pdfDoc.moveTo(72, 110).lineTo(530, 110).lineWidth(1).stroke('#ccc')

        let productsHeight = 0

        order.products.forEach((prod, index) => {
            if (isCartItemDoc(prod)) {
                pdfDoc
                    .fillColor('#323232')
                    .font('Helvetica-Bold')
                    .fontSize(14)
                    .text(
                        `${prod.product.title} x ${prod.quantity} : $${
                            prod.product.price * prod.quantity
                        }`,
                        72,
                        130 + 30 * index
                    )
            }
            productsHeight = 130 + 30 * index
        })
        pdfDoc
            .fillColor('#323232')
            .font('Helvetica-Bold')
            .fontSize(14)
            // eslint-disable-next-line
            .text(`Total: $${order.totalPrice}`, {
                align: 'right'
            })
        pdfDoc.end()
    } else {
        next()
    }
}

export const postOrder = async (
    req: PostOrderRequest,
    res: Response
): Promise<void> => {
    if (req.user && req.session.user) {
        // eslint-disable-next-line
        const {
            cart: { items }
        } = await req.user.populate('cart.items.productId').execPopulate()

        const products = items.map(item => {
            if (
                typeof item.productId === 'object' &&
                '_doc' in item.productId
            ) {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc } as ProductModel
                }
            }
            return {
                quantity: item.quantity,
                product: item.productId
            }
        })

        // eslint-disable-next-line
        await Order.create({
            user: {
                // eslint-disable-next-line
                first_name: req.session.user.first_name as string,
                // eslint-disable-next-line
                last_name: req.session.user.last_name as string,
                // eslint-disable-next-line
                userId: req.session.user
            },
            products,
            totalPrice: currencyFormatter(req.body.totalPrice),
            createdAt: format(new Date(), 'MMMM dd, yyyy')
        })

        if (req.user && req.user.clearCart) {
            // eslint-disable-next-line
            await req.user.clearCart()
        }
    }
    res.redirect('/orders')
}
