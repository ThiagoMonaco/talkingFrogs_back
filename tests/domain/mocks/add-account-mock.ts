import { faker } from '@faker-js/faker'
import { AddAccount } from '@domain/usecases/add-account'

export const mockAddAccountParams = (): AddAccount.Params => ({
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
})