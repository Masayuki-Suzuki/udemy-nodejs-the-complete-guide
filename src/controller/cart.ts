import { Request, Response } from 'express'
import products from '../models/product'

export type PostItemToCart = Request<unknown, unknown, { uuid: string }>

// export const getCartPage = async (
//     req: Request,
//     res: Response
// ): Promise<void> => {
//     const cartData = await Cart.getCartData()
//     if (typeof cartData === 'string') {
//         res.status(500).send(cartData)
//     } else {
//         res.render('shop/cart', {
//             title: 'Your Shopping Cart | Shops!',
//             path: 'shop-cart',
//             products: cartData.products,
//             totalPrice: currencyFormatter(cartData.totalPrice)
//         })
//     }
// }

export const addItemToCart = async (
    req: PostItemToCart,
    res: Response
): Promise<void> => {
    const product = await products.findOne({ where: { uuid: req.body.uuid } })
    console.info(product)
    // Cart.addProduct(product)
    res.redirect('/cart')
}

// export const deleteItemFromCart = async (
//     req: PostItemToCart,
//     res: Response
// ): Promise<void> => {
//     const result = await Cart.deleteProduct(req.body.uuid)
//     if (result) {
//         res.status(500).send(result)
//     }
//     res.redirect('/cart')
// }
