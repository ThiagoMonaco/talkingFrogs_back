import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '@main/config/app'

describe('SignUp routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })
    test('should return account correctly on signup', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'test',
                email: 'test@gmail.com',
                password: 'password',
                passwordConfirmation:'password'
            }).expect(200)
    })
})