import { Request, Response } from 'express'
import { ProductModel } from './models'

export type PromiseController<T = Request> = (req: T, res: Response) => void
export type PostProductRequest = Request<unknown, unknown, ProductModel>
export type PostDeleteProductReq = Request<unknown, unknown, { id: string }>
