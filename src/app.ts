import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import errorController from './controller/error'
import { User } from './models/user'
import { UserType } from './types/models'
import { database } from './utils/database'

dotenv.config()
const app = express()

app.set('view engine', 'pug')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.getPageNotFound)

// Create root user
// eslint-disable-next-line
// export const createRootUser = async (): Promise<void> => {

app.listen(4000)
