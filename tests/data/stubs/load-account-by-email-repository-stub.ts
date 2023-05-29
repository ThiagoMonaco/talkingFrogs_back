import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { faker } from '@faker-js/faker'
import { AccountModel } from '@domain/models/account'

export class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    result: AccountModel = {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.datatype.uuid(),
        questions: [],
        isEmailVerified: true,
    }
    async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
        if(this.result) {
            this.result.email = email
        }
        return this.result
    }
}