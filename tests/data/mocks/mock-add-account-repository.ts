import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { faker } from '@faker-js/faker'

export const mockAddAccountRepositoryResult = (): AddAccountRepository.Result => ({
    name: faker.name.fullName(),
})

export const mockAddAccountRepositoryParams = (): AddAccountRepository.Params => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
})