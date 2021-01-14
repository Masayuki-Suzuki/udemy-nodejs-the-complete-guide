import Express from 'express'
import { RequestWithUserModel } from '../types/express'
import prisma from '../prisma'

export default (app: Express.Application): void => {
    app.use(
        async (req: RequestWithUserModel, res, next): Promise<void> => {
            const user = await prisma.users.findUnique({
                where: { id: 1 }
            })
            req.user = user
            next()
        }
    )
}
