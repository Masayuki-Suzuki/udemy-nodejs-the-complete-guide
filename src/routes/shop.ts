import express from 'express'
import { getCartPage,
    getCheckoutPage,
    getIndexPage,
    getOrdersPage,
    getProductDetailPage } from '../controller/shop'

const router = express.Router()

router.get('/shop/orders', getOrdersPage)
router.get('/shop/product/:productId', getProductDetailPage)
router.get('/cart', getCartPage)
router.get('/cart/checkout', getCheckoutPage)
router.get('/', getIndexPage)

export default router
