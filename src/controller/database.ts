import { v4 as uuidV4 } from 'uuid'
import Cart from '../models/cart'
import Products from '../models/product'
import User from '../models/user'
import sequelize from '../utils/database'
import CartItem from '../models/cartItem'

export const db_connect = async (): Promise<void> => {
    Products.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
    User.hasMany(Products)
    User.hasOne(Cart)
    Cart.belongsTo(User)
    Cart.belongsToMany(Products, { through: CartItem })
    Products.belongsToMany(Cart, { through: CartItem })

    await sequelize.sync().catch(err => console.error(err))

    const user = await User.findByPk(1).catch(err => {
        console.error(err)
    })

    if (!user) {
        await User.create({
            uuid: uuidV4(),
            first_name: 'Masayuki',
            last_name: 'Suzuki',
            email: 'm.suzuki.fp@gmail.com'
        }).catch(err => {
            console.error(err)
            console.error(`Couldn't create root user.`)
        })

        console.info('Created Root User.')
    }
}
