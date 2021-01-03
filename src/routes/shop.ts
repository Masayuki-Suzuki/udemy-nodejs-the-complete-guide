import express from 'express'
import { getCartPage, getIndexPage } from '../controller/shop'

const router = express.Router()

router.get('/', getIndexPage)
router.get('/cart', getCartPage)

export default router
