import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'

let errorCollection: Collection
describe('Log Mongo Repository Test', function () {

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        errorCollection = MongoHelper.getCollection('errors')
        await errorCollection.deleteMany({})
    })

    test('Should create an error log', async () => {
        const sut = new LogErrorMongoRepository()
        await sut.logError('error')
        const count = await errorCollection.countDocuments()
        expect(count).toBe(1)
    })
})