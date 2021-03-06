import path from 'path'
import fs from 'fs-extra'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import session from 'express-session'
import ConnectMongoDbSession from 'connect-mongodb-session'
import csurf from 'csurf'
import flash from 'connect-flash'
import multer from 'multer'
import { v4 as uuidV4 } from 'uuid'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'
import errorController from './controller/error'
import User from './models/User'
import { DocumentUser } from './types/models'
import { isAdminUser } from './middleware/authentication'

dotenv.config()
const app = express()
const MongoDbStore = ConnectMongoDbSession(session)
const store = new MongoDbStore({
    uri: process.env.MONGO_URL as string,
    collection: 'sessions',
    databaseName: process.env.MDB_NAME as string
})
const csrfProtection = csurf()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = './src/public/images/products/'
        try {
            fs.statSync(dest)
        } catch (_) {
            fs.mkdirSync(dest)
        }
        cb(null, dest)
    },
    filename(req, file, cb) {
        cb(null, `${uuidV4()}.${file.mimetype.split('/')[1]}`)
    }
})

app.set('view engine', 'pug')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage }).single('image'))
app.use(
    session({
        secret: 'My Secret',
        resave: false,
        saveUninitialized: false,
        store
    })
)
app.use(csrfProtection)
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('/dist/src/public'))
app.use('/admin', isAdminUser)

app.use(
    async (req, res, next): Promise<void> => {
        res.locals.csrfToken = req.csrfToken()

        if (req.session.user) {
            const user = (await User.findById(req.session.user._id).catch(
                err => {
                    console.error(err)
                }
            )) as DocumentUser

            req.user = user
            res.locals.user = req.session.user

            next()
        } else {
            next()
        }
    }
)

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.getPageNotFound)

mongoose
    .connect(process.env.MONGO_URL as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
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
