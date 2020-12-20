import path from 'path'
import express from 'express'
import { rootPath } from '../utils/rootPath'

type Product = {
    title: string
}

type RequestAddProduct = Request

const router = express.Router()
const getFilePath = (filename: string): string => {
    return path.join(rootPath, 'views', 'admin', `${filename}.html`)
}

const products: Product[] = []

router.get('/add-product', (req, res) => {
    res.sendFile(getFilePath('add-product'))
})

router.get('/products', (req, res) => {
    res.render('./admin/dashboard', {
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
        console.log(req.body.title)
        products.push({ title: req.body.title })
        res.redirect('/')
    }
)

export default router
