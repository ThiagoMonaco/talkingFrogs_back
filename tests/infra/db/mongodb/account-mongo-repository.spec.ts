import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { mockAddAccountRepositoryParams } from '@tests/domain/mocks/mock-add-account-repository'
import { Collection } from 'mongodb'

let accountCollection: Collection
describe('Mongo Account Repository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('add()', () => {
        test('should return accountName on addAccount correctly', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountRepositoryParams()

            const result = await sut.add(params)

            expect(result).toBe(params.name)
        })
    })

    describe('checkByEmail()', () => {
        test('should return true if email exists', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountRepositoryParams()
            await accountCollection.insertOne(params)

            const result = await sut.checkByEmail(params.email)

            expect(result).toBe(true)
        })

        test('should return false if email does not exists', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountRepositoryParams()

            const result = await sut.checkByEmail(params.email)

            expect(result).toBe(false)
        })
    })



})