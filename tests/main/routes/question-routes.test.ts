import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import request from 'supertest'
import app from '@main/config/app'
import { faker } from '@faker-js/faker'


let accountCollection: Collection
const salt = 12
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
})