import { Request, Response } from 'express'
import { RequestWithUserModel } from 'src/types/express'
import prisma from '../prisma'

export type PostItemToCart = Request<unknown, unknown, { uuid: string }>

export const getCartPage = async (
    req: RequestWithUserModel,
    res: Response
): Promise<void> => {
    const userCart = await prisma.users
        .findUnique({
            where: { id: req.user!.id },
            include: { carts: true }
        })
        .catch(err => {
            console.error(err)
            res.send('Get Cart Data Error.')
        })

    if (userCart) {
        // console.log(userCart.carts)
        res.render('shop/cart', {
            title: 'Your Shopping Cart | Shops!',
            path: 'shop-cart',
            products: userCart.carts
        })
    }
    // const userCart = await Cart.findOne({
    //     where: { userId: req.user ? req.user.id : null }
    // })

    // if (!userCart) {
    //     Cart.create()
    // }

    // const cartData = await Cart.getCartData()
    // if (typeof cartData === 'string') {
    //     res.status(500).send(cartData)
    // } else {
    // res.render('shop/cart', {
    //     title: 'Your Shopping Cart | Shops!',
    //     path: 'shop-cart',
    //     products: data.products,
    //     totalPrice: data(cartData.totalPrice)
    // })
    // }
}

export const addItemToCart = async (
    req: PostItemToCart,
    res: Response
): Promise<void> => {
    let userId = 1
    let uuid = ''
    if (req.user && req.user.id) {
        userId = req.user.id
        uuid = req.user.uuid
    }

    // const product = await prisma.products.findUnique({
    //     where: { uuid: req.body.uuid }
    // })

    const userCart = await prisma.users.findUnique({
        where: { uuid },
        include: {
            carts: true
        }
    })

    if (userCart && !userCart.carts.length) {
        const result = await prisma.carts.create({
            data: {
                users: { connect: { id: userId } },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        console.info(result)
    }

    // if (cartItems.length && product) {
    //     const result = await prisma.cartItems.create({
    //         data: {
    //             products: [product]
    //         }
    //     })
    // }

    //
    // const result = await prisma.carts.update({
    //     where: { userId: 1}
    // })

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
