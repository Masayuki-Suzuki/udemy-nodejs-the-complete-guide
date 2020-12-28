import express from 'express'
import { getCartPage,
    getCheckoutPage,
    getIndexPage,
    getOrdersPage,
    getProductDtailPage } from '../controller/shop'

const router = express.Router()

router.get('/shop/orders', getOrdersPage)
router.get('/shop/product/:productId', getProductDtailPage)
router.get('/cart', getCartPage)
router.get('/cart/checkout', getCheckoutPage)
router.get('/', getIndexPage)

export default router
