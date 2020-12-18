import express from 'express'

const app = express()

app.use('/', (req, res, next) => {
    console.log('First middleware')
    next()
})

app.use('/users', (req, res) => {
    console.log('Second middleware')
    res.send('<h2 style="font-family: sans-serif; font-weight: 500">Users</h2>')
})

app.use('/', (req, res) => {
    console.log('3rd middleware')
    res.send(
        '<h2 style="font-family: sans-serif; font-weight: 500">Hello!</h2>'
    )
})

app.listen(4000)
