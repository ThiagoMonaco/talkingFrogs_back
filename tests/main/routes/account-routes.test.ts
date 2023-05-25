import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '@main/config/app'
import { Collection } from 'mongodb'
import { mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import bcrypt from 'bcrypt'


let accountCollection: Collection
const salt = 12
describe('Account routes', () => {
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

    describe('POST /signup', () => {
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

    describe('POST /login', () => {
        test('should return 200 on login', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            const hashedPassword= await bcrypt.hash(accountParams.password, salt)
            const originalPassword = accountParams.password
            accountParams.password = hashedPassword

            await accountCollection.insertOne(accountParams)

            await request(app)
                .post('/api/login')
                .send({
                    email: accountParams.email,
                    password: originalPassword
                }).expect(200)
        })

        test('should return 401 on login with invalid credentials', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            accountParams.password = await bcrypt.hash(accountParams.password, salt)

            await accountCollection.insertOne(accountParams)

            await request(app)
                .post('/api/login')
                .send({
                    email: accountParams.email,
                    password: 'invalidPassword'
                }).expect(401)
        })
    })
})