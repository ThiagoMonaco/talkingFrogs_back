import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { mockAddAccountRepositoryResult } from '@tests/data/mocks/mock-add-account-repository'


export class AddAccountRepositoryStub implements AddAccountRepository {
    account: AddAccountRepository.Params
    result: AddAccountRepository.Result = mockAddAccountRepositoryResult()
    async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
        this.account = account
        return this.result
    }
}