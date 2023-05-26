import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { mockAddAccountParams } from '@tests/domain/mocks/add-account-mock'
import { Collection, ObjectId } from 'mongodb'
import { mockAccountModel, mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import { faker } from '@faker-js/faker'
import { AddQuestionRepository } from '@data/protocols/db/question/add-question-repository'
import { mockAskQuestionParams } from '@tests/data/mocks/ask-question-mock'
import { mockQuestionModel } from '@tests/domain/mocks/question-model-mock'

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
                accountName: baseAccountParams.name,
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
                accountName: faker.internet.userName(),
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

    describe('answerQuestion()', () => {
        test('should return true if answerQuestion success', async () => {
            const sut = new AccountMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const answerText = faker.lorem.sentence()
            const questionId = new ObjectId('012345678910')

            questionParams.answer = null
            questionParams.questionId = questionId.toString()

            const insertResult = await accountCollection.insertOne(
                { ...accountParams, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const result = await sut.answerQuestion({
                answer: answerText,
                questionId: questionParams.questionId,
                accountId: insertResult.insertedId.toString()
            })

            const account = await accountCollection.findOne({ _id: insertResult.insertedId })
            expect(result).toBeTruthy()
            expect(account.questions).toHaveLength(1)
            expect(account.questions[0].answer).toBe(answerText)
            expect(account.questions[0].question).toBe(questionParams.question)
            expect(account.questions[0].questionId.toString()).toBe(questionId.toString())
        })

        test('should return false when not found account', async () => {
            const sut = new AccountMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const answerText = faker.lorem.sentence()
            const questionId = new ObjectId('012345678910')

            questionParams.answer = null
            questionParams.questionId = questionId.toString()

            const insertResult = await accountCollection.insertOne(
                { ...accountParams, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const result = await sut.answerQuestion({
                answer: answerText,
                questionId: questionParams.questionId,
                accountId: '012345678910'
            })

            const account = await accountCollection.findOne({ _id: insertResult.insertedId })
            expect(result).toBeFalsy()
            expect(account.questions[0].answer).toBeNull()
        })

        test('should return false when not found question', async () => {
            const sut = new AccountMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const answerText = faker.lorem.sentence()
            const questionId = new ObjectId('012345678910')

            questionParams.answer = null
            questionParams.questionId = questionId.toString()

            const insertResult = await accountCollection.insertOne(
                { ...accountParams, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const result = await sut.answerQuestion({
                answer: answerText,
                questionId: '109876543210',
                accountId: insertResult.insertedId.toString()
            })

            const account = await accountCollection.findOne({ _id: insertResult.insertedId })
            expect(result).toBeFalsy()
            expect(account.questions[0].answer).toBeNull()
        })

        test('should return false when question is not in target account', async () => {
            const sut = new AccountMongoRepository()

            const withQuestionAccount = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const answerText = faker.lorem.sentence()
            const questionId = new ObjectId('012345678910')

            questionParams.answer = null
            questionParams.questionId = questionId.toString()

            const insertWithQuestionResult = await accountCollection.insertOne(
                { ...withQuestionAccount, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const withoutQuestionAccount = mockAccountModelWithAccessToken()
            const insertWithoutQuestionResult = await accountCollection.insertOne(withoutQuestionAccount)

            const result = await sut.answerQuestion({
                answer: answerText,
                questionId: questionParams.questionId,
                accountId: insertWithoutQuestionResult.insertedId.toString()
            })

            const account = await accountCollection.findOne({ _id: insertWithQuestionResult.insertedId })
            expect(result).toBeFalsy()
            expect(account.questions).toHaveLength(1)
            expect(account.questions[0].answer).toBeNull()
        })
    })
})