import path from 'path'
import express from 'express'
import { rootPath } from '../utils/rootPath'

const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(rootPath, 'views', 'index.html'))
})

export default router
