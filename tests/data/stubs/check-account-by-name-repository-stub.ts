import { CheckAccountByNameRepository } from '@data/protocols/db/account/check-account-by-name-repository'

export class CheckAccountByNameRepositoryStub implements CheckAccountByNameRepository {
    result = false
    async checkByName(name: string): Promise<CheckAccountByNameRepository.Result> {
        return this.result
    }
}