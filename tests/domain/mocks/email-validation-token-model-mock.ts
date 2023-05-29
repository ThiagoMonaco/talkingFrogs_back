import { EmailValidationTokenModel } from '@domain/models/email-validation-token'
import { faker } from '@faker-js/faker'

export const mockEmailValidationTokenModel = (): EmailValidationTokenModel => ({
    email: faker.internet.email(),
    token: faker.random.alphaNumeric(5),
    id: faker.datatype.uuid()
})