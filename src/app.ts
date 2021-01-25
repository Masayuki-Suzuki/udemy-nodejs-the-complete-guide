import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import errorController from './controller/error'
import MgUser from './models/user'
import { DocumentUser, UserWithCart } from './types/models'
import { RequestWithUserModel } from './types/express'

dotenv.config()
const app = express()

app.set('view engine', 'pug')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req: RequestWithUserModel, res, next) => {
    const user = (await MgUser.findById(
        '600528241f408ff2d4837824'
    )) as UserWithCart

    if (!user) {
        req.user = new MgUser({
            first_name: 'Masayuki',
            last_name: 'Suzuki',
            email: 'example@example.com',
            role: 'admin',
            cart: {
                items: []
            }
        })
    } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        req.user = user as DocumentUser
    }
    next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.getPageNotFound)

// Create root user
// eslint-disable-next-line
// export const createRootUser = async (): Promise<void> => {

app.listen(4000)
