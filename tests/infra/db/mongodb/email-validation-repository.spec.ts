import { EmailValidationRepository } from '@infra/db/mongodb/email-validation-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { faker } from '@faker-js/faker'

let emailValidationTokensCollection: Collection
describe('EmailValidationMongoRepository', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll(async () => {
        await MongoHelper.disconnect()
    })

    beforeEach(async () => {
        emailValidationTokensCollection = MongoHelper.getCollection('emailValidationToken')
        await emailValidationTokensCollection.deleteMany({})
    })

    describe('generate()', () => {
        test('Should return token on success', async () => {
            const sut = new EmailValidationRepository()
            const params = {
                email: faker.internet.email(),
                uuid: faker.datatype.uuid()
            }

            const token = await sut.generate(params)

            const emailValidationToken = await emailValidationTokensCollection.findOne({ email: params.email })

            expect(token).toBe(params.uuid.slice(0, 5))
            expect(emailValidationToken.email).toBe(params.email)
            expect(emailValidationToken.token).toBe(token)
        })
    })

    describe('validateEmailToken()', () => {
        test('Should return true on success', async () => {
            const sut = new EmailValidationRepository()
            const params = {
                accountEmail: faker.internet.email(),
                token: faker.datatype.uuid()
            }

            await emailValidationTokensCollection.insertOne({
                email: params.accountEmail,
                token: params.token
            })

            const isValid = await sut.validateEmailToken(params)

            expect(isValid).toBeTruthy()
            expect(await emailValidationTokensCollection.countDocuments()).toBe(0)
        })

        test('Should return false if token is invalid', async () => {
            const sut = new EmailValidationRepository()
            const params = {
                accountEmail: faker.internet.email(),
                token: faker.datatype.uuid()
            }

            await emailValidationTokensCollection.insertOne({
                email: params.accountEmail,
                token: params.token
            })

            const isValid = await sut.validateEmailToken({
                accountEmail: params.accountEmail,
                token: 'wrong_token'
            })

            expect(isValid).toBeFalsy()
            expect(await emailValidationTokensCollection.countDocuments()).toBe(1)
        })
    })

})