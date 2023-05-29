import { SetAccountEmailValidatedRepository } from '@data/protocols/db/account/set-account-email-validated-repository'

export class SetAccountEmailValidatedRepositoryStub implements SetAccountEmailValidatedRepository {
    result = true
    async setEmailValidated(accountId) {
        return this.result
    }
}