import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import errorController from './controller/error'
import sequelize from './utils/database'

dotenv.config()
const app = express()

const db_connect = async (): Promise<void> => {
    await sequelize.sync()
}

app.set('view engine', 'pug')
app.set('views', 'src/views')

// Test Connecting DB
// ;(async () => {
//     const data = await db.execute('SELECT * FROM products').catch(err => {
//         console.error(err)
//     })
//     console.log(data[0])
// })()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.getPageNotFound)

//eslint-disable-next-line
db_connect()

app.listen(4000)
