import path from 'path'
import express from 'express'
import { rootPath } from '../utils/rootPath'

const router = express.Router()
const getFilePath = (filename: string): string => {
    return path.join(rootPath, 'views', 'admin', `${filename}.html`)
}

router.get('/add-product', (req, res) => {
    res.sendFile(getFilePath('add-product'))
})

router.get('/products', (req, res) => {
    res.sendFile(getFilePath('products'))
})

router.get('/dashboard', (req, res) => {
    res.sendFile(getFilePath('dashboard'))
})

router.get('/', (req, res) => {
    res.redirect('/admin/dashboard')
})

router.post('/product', (req, res) => {
    console.log(req.body)
    res.redirect('/')
})

export default router
