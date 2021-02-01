import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import session from 'express-session'
import ConnectMongoDbSession from 'connect-mongodb-session'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import errorController from './controller/error'
import User from './models/user'
import { DocumentUser, UserWithCart } from './types/models'
import { RequestWithUserModel } from './types/express'

dotenv.config()
const app = express()
const MongoDbStore = ConnectMongoDbSession(session)
const store = new MongoDbStore({
    uri: process.env.MONGO_URL as string,
    collection: 'sessions',
    databaseName: process.env.MDB_NAME as string
})

app.set('view engine', 'pug')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(
    session({
        secret: 'My Secret',
        resave: false,
        saveUninitialized: false,
        store
    })
)
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req: RequestWithUserModel, res, next) => {
    const user = (await User.findById(
        '600528241f408ff2d4837824'
    )) as UserWithCart

    if (!user) {
        req.user = new User({
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

mongoose
    .connect(process.env.MONGO_URL as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: process.env.db_user,
        pass: process.env.db_password,
        dbName: process.env.db_database
    })
    .then(() => {
        console.info('Mongoose: connected DB.')
        app.listen(4000, () => {
            console.info('Server started.')
        })
    })
    .catch(err => {
        console.error(err)
    })
