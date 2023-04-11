import { Authentication } from '@domain/usecases/authentication'
import { faker } from '@faker-js/faker'

export const mockAuthenticationParams = (): Authentication.Params => ({
    email: faker.internet.email(),
    password: faker.internet.password()
})