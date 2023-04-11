import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { mockAddAccountParams } from '@tests/domain/mocks/add-account-mock'
import { Collection } from 'mongodb'
import { mockAccountModel } from '@tests/domain/mocks/account-model-mock'
import { faker } from '@faker-js/faker'

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
            const params = mockAddAccountParams()

            const result = await sut.add(params)

            expect(result).toBe(params.name)
        })
    })

    describe('checkByEmail()', () => {
        test('should return true if email exists', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountParams()
            await accountCollection.insertOne(params)

            const result = await sut.checkByEmail(params.email)

            expect(result).toBe(true)
        })

        test('should return false if email does not exists', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountParams()

            const result = await sut.checkByEmail(params.email)

            expect(result).toBe(false)
        })
    })

    describe('loadByEmail()', () => {
        test('should return account on loadByEmail correctly', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountParams()
            await accountCollection.insertOne(params)

            const result = await sut.loadByEmail(params.email)

            expect(result).toBeTruthy()
            expect(result.id).toBeTruthy()
            expect(result.name).toBe(params.name)
            expect(result.password).toBe(params.password)
            expect(result.email).toBe(params.email)
        })

        test('should return null if loadByEmail fails', async () => {
            const sut = new AccountMongoRepository()

            const result = await sut.loadByEmail('')

            expect(result).toBeNull()
        })
    })

    describe('updateAccessToken()', () => {
        test('should update the account accessToken on updateAccessToken success', async () => {
            const sut = new AccountMongoRepository()

            const accountParams = mockAccountModel()
            const res = await accountCollection.insertOne(accountParams)
            const fakeAccount = await accountCollection.findOne({ _id: res.insertedId })
            expect(fakeAccount.accessToken).toBeFalsy()

            const token = faker.datatype.uuid()
            await sut.updateAccessToken(fakeAccount._id.toString(), token)
            const account = await accountCollection.findOne({ _id: fakeAccount._id })

            expect(account).toBeTruthy()
            expect(account.accessToken).toBe(token)
        })
    })

})