import dotenv from 'dotenv'
import mysql from 'mysql2'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    database: process.env.db_database,
    password: process.env.db_password
})

export default pool.promise()
