import {
    CheckAccountByEmailRepository,
} from '@data/protocols/db/account/check-account-by-email-repository'

export class CheckAccountByEmailRepositoryStub implements CheckAccountByEmailRepository {
    email: string
    accountExists = false

    checkByEmail(email: CheckAccountByEmailRepository.Params): Promise<CheckAccountByEmailRepository.Result> {
        this.email = email
        return Promise.resolve(this.accountExists)
    }
}