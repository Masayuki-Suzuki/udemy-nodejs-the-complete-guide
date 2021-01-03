import express from 'express'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'
import { PostDeleteProductReq, PromiseController } from '../types/controllers'

const router = express.Router()

router.get('/add-product', ProductsController.getAddProductPage)
router.get(
    '/edit-product/:productId',
    ProductsController.getEditProductPage as PromiseController
)
router.get('/products', ProductsController.getProductPage as PromiseController)
router.get('/dashboard', AdminController.getDashboardPage)
router.get('/', AdminController.redirectToDashboard)

router.post('/add-product', ProductsController.postAddProduct)
router.post('/edit-product', ProductsController.postEditProduct)
router.post(
    '/delete-product',
    ProductsController.postDeleteProduct as PromiseController<PostDeleteProductReq>
)

export default router
