import express from 'express'
import { addItemToCart,
    getCartPage,
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

// eslint-disable-next-line
router.post('/cart', addItemToCart)

export default router
