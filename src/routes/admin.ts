import path from 'path'
import express from 'express'
import { rootPath } from '../utils/rootPath'

type Product = {
    product_name: string
}

const router = express.Router()
const getFilePath = (filename: string): string => {
    return path.join(rootPath, 'views', 'admin', `${filename}.html`)
}

const products: Product[] = []

router.get('/add-product', (req, res) => {
    res.render('./admin/add-product', {
        title: 'Add Product',
        path: 'add-product',
        pageTitle: 'Add Product'
    })
})

router.get('/products', (req, res) => {
    res.render('./admin/products', {
        title: 'Products list',
        path: 'products',
        pageTitle: 'Products'
    })
})

router.get('/dashboard', (req, res) => {
    res.render('./admin/dashboard', {
        title: 'Admin Dashboard',
        path: 'dashboard',
        pageTitle: 'Dashboard'
    })
})

router.get('/', (req, res) => {
    res.redirect('/admin/dashboard')
})

router.post(
    '/product',
    (req: express.Request<unknown, unknown, Product>, res) => {
        products.push({ product_name: req.body.product_name })
        res.redirect('/admin/products')
    }
)

export default router
