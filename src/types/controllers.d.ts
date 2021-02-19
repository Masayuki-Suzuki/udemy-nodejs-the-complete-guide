import { Request, Response } from 'express'
import { CustomRequestWithParam, RequestWithUserModel } from './express'
import { ProductModel } from './models'

export type SignUpDataType = {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    role?: 'supervisor' | 'admin' | 'customer'
    editMode: boolean
}

export type PromiseController<Req = Request, Res = Response, Rt = void> = (
    req: Req,
    res: Res
) => Rt
export type PostProductRequest = RequestWithUserModel<ProductModel>
export type PostDeleteProductReq = Request<unknown, unknown, { id: string }>
export type PostOrderRequest = Request<unknown, unknown, { totalPrice: number }>
export type PostSignUpRequest = Request<unknown, unknown, SignUpDataType>
export type GetNewPasswordRequest = CustomRequestWithParam<{
    resetToken: string
}>
export type GetNewPasswordController = PromiseController<
    GetNewPasswordRequest,
    Response,
    Promise<void>
>
