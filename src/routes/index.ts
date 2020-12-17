import * as fs from 'fs'
import { IncomingMessage, ServerResponse } from 'http'

export const requestHanlder = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url
    const method = req.method

    res.setHeader('Content-Type', 'text/html')

    if (url === '/') {
        res.write('<!doctype html>')
        res.write('<html>')
        res.write('<header>')
        res.write('<title>Give Me Your Message</title>')
        res.write('</header>')
        res.write('<body>')
        res.write('<div class="container">')
        res.write('<form action="/message" method="POST">')
        res.write('<label>Give Me Your Message!!<br>')
        res.write('<input name="message">')
        res.write('<button type="submit">Submit</button>')
        res.write('</label>')
        res.write('</form>')
        res.write('</label>')
        res.write('</div>')
        res.write('</body>')
        res.write('</html>')
        return res.end()
    }

    if (url === '/message' && method === 'POST') {
        const body: string[] = []

        req.on('data', (chunk: string) => {
            body.push(chunk)
        })

        req.on('end', () => {
            const parsedBody = Buffer.concat(body as any).toString()
            const message = parsedBody.split('=')[1]
            fs.writeFile('message.text', message, err => {
                res.statusCode = 302
                res.setHeader('Location', '/')
                return res.end()
            })
        })
    }

    res.write('Hello...')
    res.end()
}
