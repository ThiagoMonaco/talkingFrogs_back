import { SetAccountEmailValidated } from '@domain/usecases/set-account-email-validated'
import { SetAccountEmailValidatedRepository } from '@data/protocols/db/account/set-account-email-validated-repository'

export class DbSetAccountEmailValidated implements SetAccountEmailValidated {
    constructor(
        private readonly setAccountEmailValidatedRepository: SetAccountEmailValidatedRepository
    ) {}

    async setEmailValidated(accountId: SetAccountEmailValidated.Params): Promise<SetAccountEmailValidated.Result> {
        return await this.setAccountEmailValidatedRepository.setEmailValidated(accountId)
    }
}