import { DataTypes } from 'sequelize'
import sequelize from '../utils/database'

const CartItem = sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: DataTypes.INTEGER
})

export default CartItem
