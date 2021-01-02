import express from 'express'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'

const router = express.Router()

router.get('/add-product', ProductsController.getAddProductPage)

// eslint-disable-next-line
router.get('/edit-product/:productId', ProductsController.getEditProductPage)

// eslint-disable-next-line
router.get('/products', ProductsController.getProductPage)

router.get('/dashboard', AdminController.getDashboardPage)

router.get('/', AdminController.redirectToDashboard)

router.post('/add-product', ProductsController.postAddProduct)

router.post('/edit-product', ProductsController.postEditProduct)

export default router
