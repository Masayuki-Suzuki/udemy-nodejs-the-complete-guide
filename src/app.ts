import * as http from 'http'

const server = http.createServer((req, res) => {
    const { url, method } = req
    const users = ['User 1', 'User 2', 'User 3']

    res.setHeader('Content-Type', 'text/html')

    switch (url) {
        case '/users':
            res.write(
                `
<!DOCTYPE html>
<html>
    <head>
        <title>Section 3 Assignment</title>
    </head>
    <body>`
            )
            res.write(' <h3>Users</h3>')
            res.write(' <ul>')
            users.forEach(user => {
                res.write(`<li>${user}</li>`)
            })
            res.write(' </ul>')
            res.write(' <div>')
            res.write(' <h4>Create a New User</h4>')
            res.write(' <form action="/create-user" method="POST">')
            res.write(' <label>Name:')
            res.write(' <input name="username" placeholder="John Snow"/>')
            res.write(' </label>')
            res.write(' <button type="submit">Submit</button>')
            res.write(' </form>')
            res.write(' </div>')
            break

        case '/create-user':
            if (method === 'POST') {
                const body: string[] = []

                req.on('data', (chunk: string) => {
                    body.push(chunk)
                })

                req.on('end', () => {
                    const parsedBody = Buffer.concat(body as any).toString()
                    const user = parsedBody.split('=')[1]
                    console.log(user)
                })

                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            } else {
                res.statusCode = 302
                res.setHeader('Location', '/')

                return res.end()
            }
            break

        case '/':
            res.write(
                `
<!DOCTYPE html>
<html>
    <head>
        <title>Section 3 Assignment</title>
    </head>
    <body>`
            )
            res.write(' <h3>Hello! Admin</h3>')
            res.write('<div><a href="/users">Go to Admin Page</a></div>')
            break

        default:
            res.write('<h1>Page Not Found...</h1>')
    }
    res.write(`
        </body>
</html>
    `)

    res.end()
})

server.listen(4000)
