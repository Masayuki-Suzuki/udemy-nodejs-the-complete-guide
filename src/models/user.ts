import { model, Document } from 'mongoose'
import { ProductModel, UserWithCart } from '../types/models'
import UserSchema from '../Schemas/User'

UserSchema.methods.addToCart = function (product: ProductModel) {
    const cartProductIndex = this.cart.items.findIndex(
        cp => cp.productId.toString() === product._id.toString()
    )

    const updatedCarItems = [...this.cart.items]
    let newQuantity = 1

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCarItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCarItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }

    this.cart = { items: updatedCarItems }
    void this.save()
}

UserSchema.methods.removeCartItem = function (productId: string) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId
    })
    this.cart.items = updatedCartItems
    return this.save()
}

export default model<UserWithCart & Document>('User', UserSchema)
