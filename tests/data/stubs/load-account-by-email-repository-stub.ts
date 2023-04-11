import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { faker } from '@faker-js/faker'

export class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    result = {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.datatype.uuid()
    }
    async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
        if(this.result) {
            this.result.email = email
        }
        return this.result
    }
}