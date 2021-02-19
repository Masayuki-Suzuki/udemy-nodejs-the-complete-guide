import express from 'express'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'
import { postAdminSignup } from '../controller/auth'
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
router.get(
    '/add-new-user',
    AdminController.getEditUserPage as PromiseController
)
router.get(
    '/edit-user/:id',
    AdminController.getEditUserPage as PromiseController
)
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
router.post('/edit-user', postAdminSignup as PromiseController)

export default router
