import express from 'express'
import { body } from 'express-validator/check'
import ProductsController from '../controller/products'
import AdminController from '../controller/admin'
import {
    deleteUser,
    postActivateUser,
    postAdminSignup,
    postSuspendUser
} from '../controller/auth'
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
    [
        body('title')
            .isLength({ min: 3 })
            .withMessage(
                'Product title must be alphanumeric and at least 3 characters.'
            ),
        body('imageURL').isEmpty().withMessage('In valid URL'),
        body('price')
            .isFloat()
            .custom(val => {
                const price = parseFloat(val)
                if (price < 0) {
                    throw new Error('Price must be positive number.')
                }
                return true
            }),
        body('descriptions').trim()
    ],
    ProductsController.postAddProduct as PromiseController<PostProductRequest>
)
router.post(
    '/edit-product',
    [
        body('title')
            .isLength({ min: 3 })
            .withMessage(
                'Product title must be alphanumeric and at least 3 characters.'
            ),
        body('imageURL').isEmpty().withMessage('In valid URL'),
        body('price')
            .isFloat()
            .custom(val => {
                const price = parseFloat(val)
                if (price < 0) {
                    throw new Error('Price must be positive number.')
                }
                return true
            }),
        body('descriptions').trim()
    ],
    ProductsController.postEditProduct as PromiseController<PostProductRequest>
)
router.post(
    '/delete-product',
    ProductsController.postDeleteProduct as PromiseController<PostDeleteProductReq>
)
router.post('/edit-user', postAdminSignup as PromiseController)
router.post('/suspend-user', postSuspendUser as PromiseController)
router.post('/activate-user', postActivateUser as PromiseController)
router.post('/delete-user', deleteUser as PromiseController)

export default router
