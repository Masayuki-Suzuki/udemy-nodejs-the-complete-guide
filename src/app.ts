import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import adminRoutes from './routes/admin'
import shopRoutes from './routes/shop'

const app = express()

app.set('view engine', 'pug')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' })
})

app.listen(4000)
