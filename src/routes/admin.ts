import express from 'express'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'
import {
    PostDeleteProductReq,
    PostProductRequest,
    PromiseController
} from '../types/controllers'

const router = express.Router()

router.get('/add-product', ProductsController.getAddProductPage)
router.get(
    '/edit-product/:productId',
    ProductsController.getEditProductPage as PromiseController<PostProductRequest>
)
router.get('/users', AdminController.getUsersPage as PromiseController)
router.get('/products', ProductsController.getProductPage as PromiseController)
router.get('/dashboard', AdminController.getDashboardPage)
router.get('/', AdminController.redirectToDashboard)

router.post(
    '/add-product',
    ProductsController.postAddProduct as PromiseController<PostProductRequest>
)
router.post(
    '/edit-product',
    ProductsController.postEditProduct as PromiseController<PostProductRequest>
)
router.post(
    '/delete-product',
    ProductsController.postDeleteProduct as PromiseController<PostDeleteProductReq>
)

export default router
