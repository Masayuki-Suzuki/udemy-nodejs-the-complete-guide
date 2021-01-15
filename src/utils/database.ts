import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient

const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

export const mongoConnection = async (): Promise<void> => {
    const result = await MongoClient.connect(
        process.env.MONGO_URL as string,
        option
    ).catch(err => {
        console.error(err)
    })

    console.info(result)
}
