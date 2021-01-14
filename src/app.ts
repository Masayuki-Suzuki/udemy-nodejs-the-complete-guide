import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import errorController from './controller/error'
// import { db_connect } from './controller/database'
import extendRequestWithUserModel from './middleware/extendRequestWithUserModel'

dotenv.config()
const app = express()

app.set('view engine', 'pug')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

extendRequestWithUserModel(app)

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.getPageNotFound)

//eslint-disable-next-line
// db_connect()

app.listen(4000)
