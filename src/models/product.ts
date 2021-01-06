import { DataTypes } from 'sequelize'
import { ProductModelStrict } from '../types/models'
import sequelize from '../utils/database'

const Products = sequelize.define('products', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    price_fine: {
        type: DataTypes.STRING,
        allowNull: false
    }
}) as ProductModelStrict

export default Products
