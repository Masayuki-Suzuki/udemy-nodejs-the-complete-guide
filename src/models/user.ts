import { ObjectId } from 'mongodb'
import { UserModel, UserType } from '../types/models'
import { database } from '../utils/database'

export class User {
    readonly first_name: string
    readonly last_name: string
    readonly email: string
    readonly role: 'admin' | 'customer'

    constructor(params: UserType) {
        this.first_name = params.first_name
        this.last_name = params.last_name
        this.email = params.email
        this.role = params.role
    }

    async create(): Promise<string> {
        const db = database.getDB()
        let errorMessage = ''

        if (db) {
            const collection = db.collection('users')
            const userExisted = await collection.findOne<UserModel>({
                email: this.email
            })

            const { first_name, last_name, email, role } = this

            if (collection && !userExisted) {
                await collection
                    .insertOne({
                        first_name,
                        last_name,
                        email,
                        role
                    })
                    .catch(err => {
                        console.error(err)
                        errorMessage = 'ERROR: Failed to create new user.'
                    })
                console.info('Created new user')
            } else {
                errorMessage = 'Database: users collection was not found.'
            }
        } else {
            errorMessage = 'Data source not found.'
        }

        return errorMessage || 'Success'
    }

    static async findById(id: string) {
        const db = database.getDB()
        if (db) {
            return await db
                .collection('users')
                .findOne<UserModel>({ _id: new ObjectId(id) })
        }
    }
}
