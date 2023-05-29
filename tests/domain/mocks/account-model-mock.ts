import { AccountModel } from '@domain/models/account'
import { faker } from '@faker-js/faker'

export const mockAccountModel = (): AccountModel => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    id: faker.datatype.uuid(),
    questions: [],
    isEmailVerified: true
})

export const mockAccountModelWithAccessToken = (): AccountModel => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    id: faker.datatype.uuid(),
    accessToken: faker.datatype.uuid(),
    questions: [],
    isEmailVerified: true
})