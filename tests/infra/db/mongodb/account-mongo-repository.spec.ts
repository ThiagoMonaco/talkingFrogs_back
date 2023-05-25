import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { mockAddAccountParams } from '@tests/domain/mocks/add-account-mock'
import { Collection, ObjectId } from 'mongodb'
import { mockAccountModel, mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import { faker } from '@faker-js/faker'
import { AddQuestionRepository } from '@data/protocols/db/account/add-question-repository'

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

    describe('loadByToken()', () => {
        test('should return an account on loadByToken', async () => {
            const sut = new AccountMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            await accountCollection.insertOne(accountParams)

            const account = await sut.loadByToken(accountParams.accessToken)

            expect(account).toBeTruthy()
            expect(account.id).toBeTruthy()
        })

        test('should return null if loadByToken fails', async () => {
            const sut = new AccountMongoRepository()

            const account = await sut.loadByToken('')

            expect(account).toBeNull()
        })
    })

    describe('addQuestion', () => {
        test('should add a question on addQuestion success', async () => {
            const sut = new AccountMongoRepository()
            const baseAccountParams = mockAccountModelWithAccessToken()

            const baseAccountInsertRes = await accountCollection.insertOne(baseAccountParams)

            const questionText = faker.lorem.sentence()
            const question: AddQuestionRepository.Params = {
                targetAccountId: baseAccountInsertRes.insertedId.toString(),
                question: questionText
            }

            const result = await sut.addQuestion(question)

            const baseAccount = await accountCollection.findOne({ _id: baseAccountInsertRes.insertedId })

            expect(result).toBeTruthy()
            expect(baseAccount.questions).toBeTruthy()
            expect(baseAccount.questions.length).toBe(1)
            expect(baseAccount.questions[0].question).toBe(questionText)
        })

        test('should return null if addQuestion fails', async () => {
            const sut = new AccountMongoRepository()

            const questionText = faker.lorem.sentence()
            const question: AddQuestionRepository.Params = {
                targetAccountId: new ObjectId().toString(),
                question: questionText
            }

            const result = await sut.addQuestion(question)

            expect(result).toBeNull()
        })
    })

    describe('checkByName()', () => {
        test('should return true if name exists', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountParams()
            await accountCollection.insertOne(params)

            const result = await sut.checkByName(params.name)

            expect(result).toBeTruthy()
        })

        test('should return false if name does not exists', async () => {
            const sut = new AccountMongoRepository()
            const params = mockAddAccountParams()

            const result = await sut.checkByName(params.name)

            expect(result).toBeFalsy()
        })
    })

})