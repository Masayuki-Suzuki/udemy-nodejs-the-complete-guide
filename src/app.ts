import express from 'express'

const app = express()

app.use((req, res, next) => {
    console.log('In middle ware!')
    next()
})

app.use((req, res) => {
    res.send('<h1 style="font-family: sans-serif;">Hello World!</h1>')
})

app.listen(4000)
