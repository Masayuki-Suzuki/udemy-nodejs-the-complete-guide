import { Request, Response } from 'express'
import { RequestWithUserModel } from './express'
import { ProductModel } from './models'

export type SignUpDataType = {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
}

export type PromiseController<T = Request> = (req: T, res: Response) => void
export type PostProductRequest = RequestWithUserModel<ProductModel>
export type PostDeleteProductReq = Request<unknown, unknown, { id: string }>
export type PostOrderRequest = Request<unknown, unknown, { totalPrice: number }>
export type PostSignUpRequest = Request<unknown, unknown, SignUpDataType>
