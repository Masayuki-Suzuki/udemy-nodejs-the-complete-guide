import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { Nullable } from '../types/utilities'

dotenv.config()

export class Database {
    _db: Nullable<Db>

    constructor() {
        this._db = null
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
            })
            .catch(err => {
                console.error(err)
                throw 'Database connection error!!'
            })
    }

    getDB() {
        return this._db
    }
}

export const database = new Database()
