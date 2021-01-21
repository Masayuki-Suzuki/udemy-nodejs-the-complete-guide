import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import mongoose from 'mongoose'
import { Nullable } from '../types/utilities'

dotenv.config()

export class Database {
    _db: Nullable<Db>
    option = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: process.env.db_user,
        pass: process.env.db_password,
        dbName: process.env.db_database
    }

    constructor() {
        this._db = null
        mongoose
            .connect(process.env.MONGO_URL as string, this.option)
            .then(() => {
                console.info('Mongoose: connected DB.')
            })
            .catch(err => {
                console.error(err)
            })
        this.mongoConnection()
    }

    mongoConnection(): void {
        const option = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }

        MongoClient.connect(process.env.MONGO_URL as string, option)
            .then(data => {
                this._db = data.db('shops')
                console.log('MongoClient: connected DB.')
            })
            .catch(err => {
                console.error(err)
                throw 'Database connection error!!'
            })
    }

    getDB(): Nullable<Db> {
        return this._db
    }
}

export const database = new Database()
