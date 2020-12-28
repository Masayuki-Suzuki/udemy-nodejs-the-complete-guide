import express from 'express'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'

const router = express.Router()

router.get('/add-product', ProductsController.getAddProductPage)

router.get('/edit-product', ProductsController.getEditProductPage)

router.get('/products', ProductsController.getProductPage)

router.get('/dashboard', AdminController.getDashboardPage)

router.get('/', AdminController.redirectToDashboard)

router.post('/product', ProductsController.postAddProduct)

export default router
