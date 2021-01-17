import mongodb, { MongoClient as MongoClientType } from 'mongodb'
import { Nullable } from '../types/utilities'

const MongoClient = mongodb.MongoClient

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

let _db: mongodb.Db

export const mongoConnection = async (): Promise<void> => {
    const client = await MongoClient.connect(
        process.env.MONGO_URL as string,
        option
    ).catch(err => {
        console.error(err)
        throw 'Database connection error!!'
    })

    if (client) {
        _db = client.db('shops')
    }
}

export const getDB = (): mongodb.Db => {
    if (_db) {
        return _db
    }

    throw 'No database found!'
}
