import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
    process.env.db_database as string,
    process.env.db_user as string,
    process.env.db_password,
    {
        dialect: 'mysql',
        host: process.env.db_host
    }
)

// const pool = mysql.createPool({
//     host: process.env.db_host,
//     user: process.env.db_user,
//     database: process.env.db_database,
//     password: process.env.db_password
// })

export default sequelize
