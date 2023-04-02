import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
    client: null as MongoClient,

    async connect (url: string) {
        this.client = await MongoClient.connect(url)
    },

    async disconnect () {
        await this.client.close()
    },

    getCollection(name: string): Collection {
        return this.client.db().collection(name)
    },

    mapId: (collection: any): any => {
        const { _id, ...collectionWithoutId } = collection
        return {...collectionWithoutId, id: _id}
    },

    parseToObjectId(value: string): ObjectId {
        return new ObjectId(value)
    },
}