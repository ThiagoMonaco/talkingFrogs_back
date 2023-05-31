import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import { mockQuestionModel } from '@tests/domain/mocks/question-model-mock'
import { faker } from '@faker-js/faker'
import { AddQuestionRepository } from '@data/protocols/db/question/add-question-repository'
import { QuestionMongoRepository } from '@infra/db/mongodb/question-mongo-repository'

let accountCollection: Collection
describe('MongoDB Question Repository', () => {
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

    describe('answerQuestion()', () => {
        test('should return true if answerQuestion success', async () => {
            const sut = new QuestionMongoRepository()
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
            const sut = new QuestionMongoRepository()
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
            const sut = new QuestionMongoRepository()
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
            const sut = new QuestionMongoRepository()

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

    describe('removeQuestion()', () => {
        test('should return true if removeQuestion success', async () => {
            const sut = new QuestionMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const questionId = new ObjectId('012345678910')

            questionParams.questionId = questionId.toString()

            const insertResult = await accountCollection.insertOne(
                { ...accountParams, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const result = await sut.removeQuestion({
                questionId: questionParams.questionId,
                accountId: insertResult.insertedId.toString()
            })

            const account = await accountCollection.findOne({ _id: insertResult.insertedId })
            expect(result).toBeTruthy()
            expect(account.questions).toHaveLength(0)
        })

        test('should return false when not found account', async () => {
            const sut = new QuestionMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const questionId = new ObjectId('012345678910')

            questionParams.questionId = questionId.toString()

            const insertResult = await accountCollection.insertOne(
                { ...accountParams, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const result = await sut.removeQuestion({
                questionId: questionParams.questionId,
                accountId: '012345678910'
            })

            const account = await accountCollection.findOne({ _id: insertResult.insertedId })
            expect(result).toBeFalsy()
            expect(account.questions).toHaveLength(1)
        })

        test('should return false when not found question', async () => {
            const sut = new QuestionMongoRepository()
            const accountParams = mockAccountModelWithAccessToken()
            const questionParams = mockQuestionModel()
            const questionId = new ObjectId('012345678910')

            questionParams.questionId = questionId.toString()

            const insertResult = await accountCollection.insertOne(
                { ...accountParams, questions: [{
                        question: questionParams.question,
                        questionId: questionId,
                        answer: null
                    }]}
            )

            const result = await sut.removeQuestion({
                questionId: '109876543210',
                accountId: insertResult.insertedId.toString()
            })

            const account = await accountCollection.findOne({ _id: insertResult.insertedId })
            expect(result).toBeFalsy()
            expect(account.questions).toHaveLength(1)
        })
    })

    describe('addQuestion', () => {
        test('should add a question on addQuestion success', async () => {
            const sut = new QuestionMongoRepository()
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
            const sut = new QuestionMongoRepository()

            const questionText = faker.lorem.sentence()
            const question: AddQuestionRepository.Params = {
                accountName: faker.internet.userName(),
                question: questionText
            }

            const result = await sut.addQuestion(question)

            expect(result).toBeNull()
        })
    })
})