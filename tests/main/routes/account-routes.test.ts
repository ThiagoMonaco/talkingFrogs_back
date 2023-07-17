import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '@main/config/app'
import { Collection } from 'mongodb'
import { mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'
import bcrypt from 'bcrypt'
import { nodeMailerHelper } from '@infra/email-sender/node-mailer/helpers/node-mailer-helper'
import jwt from 'jsonwebtoken'
import env from '@main/config/env'
import { mockEmailValidationTokenModel } from '@tests/domain/mocks/email-validation-token-model-mock'
import { faker } from '@faker-js/faker'


let accountCollection: Collection
let emailValidationTokenCollection: Collection
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
        emailValidationTokenCollection = MongoHelper.getCollection('emailValidationToken')
        await emailValidationTokenCollection.deleteMany({})
    })

    describe('POST /signup', () => {
        test('should return 200 on signup', async () => {
            await nodeMailerHelper.createTransporter()
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

    describe('POST /validate-email',  () => {

        test('should return 200 on validate email', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            accountParams.isEmailVerified = false

            const insertResult = await accountCollection.insertOne(accountParams)

            const accessToken = jwt.sign({ id: insertResult.insertedId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
            await accountCollection.updateOne({ _id: insertResult.insertedId }, { $set: { accessToken } })

            const emailValidationTokenParams = mockEmailValidationTokenModel()
            emailValidationTokenParams.email = accountParams.email

            await emailValidationTokenCollection.insertOne(emailValidationTokenParams)

            await request(app)
                .post('/api/validate-email')
                .set('Cookie', `x-access-token=${accessToken}`)
                .send({
                    token: emailValidationTokenParams.token
                }).expect(200)
        })
    })

    describe('POST /send-email-token', () => {
        test('should return 200 on send email token', async () => {
          const payload = {
              email: faker.internet.email()
          }

            await request(app)
                .post('/api/send-email-token')
                .send(payload)
                .expect(200)
        })
    })

    describe('GET /user/:accountName', () => {
        test('should return 200 on get user', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            accountParams.isEmailVerified = false

            await accountCollection.insertOne(accountParams)

            await request(app)
                .get(`/api/user/${accountParams.name}`)
                .expect(200)
        })

        test('should return 400 when not found user', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            accountParams.isEmailVerified = false

            await accountCollection.insertOne(accountParams)

            await request(app)
                .get(`/api/user/notfounduser`)
                .expect(400)
        })
    })

    describe('GET /user-token', () => {
        test('should return 200 on get user by token', async () => {
            const accountParams = mockAccountModelWithAccessToken()
            // accountParams.isEmailVerified = false

            const insertResult = await accountCollection.insertOne(accountParams)

            const accessToken = jwt.sign({ id: insertResult.insertedId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
            await accountCollection.updateOne({ _id: insertResult.insertedId }, { $set: { accessToken } })

            await request(app)
                .get(`/api/user-token`)
                .set('Cookie', `x-access-token=${accessToken}`)
                .expect(200)
        })
    })
})