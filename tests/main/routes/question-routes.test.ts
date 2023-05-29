import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection, ObjectId } from 'mongodb'
import { mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import request from 'supertest'
import app from '@main/config/app'
import { faker } from '@faker-js/faker'
import { mockQuestionModel } from '@tests/domain/mocks/question-model-mock'
import jwt from 'jsonwebtoken'
import env from '@main/config/env'


let accountCollection: Collection
describe('Question routes', () => {
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

    describe('POST /ask',  () => {
        test('should return 200 on ask question', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            await accountCollection.insertOne(accountParams)

            await request(app)
                .post('/api/question/ask')
                .send({
                    accountName: accountParams.name,
                    question: faker.lorem.sentence()
                }).expect(200)
        })
    })

    describe('POST /answer', () => {

        test('should return 200 on answer question', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            const question: any = mockQuestionModel()
            question.answer = null
            question.questionId = new ObjectId('012345678910')

            accountParams.questions.push(question)
            const insertResult = await accountCollection.insertOne(accountParams)
            const accessToken = jwt.sign({ id: insertResult.insertedId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

            await accountCollection.updateOne({ _id: insertResult.insertedId }, { $set: { accessToken } })

            await request(app)
                .post('/api/question/answer')
                .set('x-access-token', accessToken)
                .send({
                    questionId: question.questionId.toString(),
                    answer: faker.lorem.sentence()
                }).expect(200)
        })
    })

    describe('POST /answer/remove', () => {

        test('should return 200 on remove answer', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            const question: any = mockQuestionModel()
            question.answer = faker.lorem.sentence()
            question.questionId = new ObjectId('012345678910')

            accountParams.questions.push(question)
            const insertResult = await accountCollection.insertOne(accountParams)
            const accessToken = jwt.sign({ id: insertResult.insertedId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

            await accountCollection.updateOne({ _id: insertResult.insertedId }, { $set: { accessToken } })

            await request(app)
                .post('/api/question/answer/remove')
                .set('x-access-token', accessToken)
                .send({
                    questionId: question.questionId.toString()
                }).expect(200)
        })
    })

    describe('POST /remove', () => {
        test('should return 200 on remove question', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            const question: any = mockQuestionModel()
            question.questionId = new ObjectId('012345678910')

            accountParams.questions.push(question)
            const insertResult = await accountCollection.insertOne(accountParams)
            const accessToken = jwt.sign({ id: insertResult.insertedId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })

            await accountCollection.updateOne({ _id: insertResult.insertedId }, { $set: { accessToken } })

            await request(app)
                .post('/api/question/remove')
                .set('x-access-token', accessToken)
                .send({
                    questionId: question.questionId.toString()
                }).expect(200)
        })
    })
})