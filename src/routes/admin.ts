import express from 'express'
import ProductsController from '../controller/products'

const router = express.Router()

router.get('/add-product', ProductsController.getAddProductPage)

router.get('/products', ProductsController.getProductPage)

router.get('/dashboard', ProductsController.getDashboardPage)

router.get('/', ProductsController.redirectToDashboard)

router.post('/product', ProductsController.postAddProduct)

export default router
