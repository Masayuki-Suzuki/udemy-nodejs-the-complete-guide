import * as http from 'http'
import { requestHanlder } from './routes'

const server = http.createServer(requestHanlder)

server.listen(4000)
