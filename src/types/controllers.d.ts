import { Request, Response } from 'express'
import { ProductType } from './models'

export type PromiseController<T = Request> = (req: T, res: Response) => void
export type PostProductRequest = Request<unknown, unknown, ProductType>
export type PostDeleteProductReq = Request<unknown, unknown, { uuid: string }>
export type CartPageRequest = Request<unknown, unknown, { uuid: string }>
