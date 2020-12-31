import express from 'express'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'

const router = express.Router()

router.get('/add-product', ProductsController.getAddProductPage)

router.get('/edit-product/:productId', ProductsController.getEditProductPage)

router.get('/products', ProductsController.getProductPage)

router.get('/dashboard', AdminController.getDashboardPage)

router.get('/', AdminController.redirectToDashboard)

router.post('/add-product', ProductsController.postAddProduct)

export default router
