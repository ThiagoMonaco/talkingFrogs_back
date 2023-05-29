import { SetAccountEmailValidated } from '@domain/usecases/set-account-email-validated'

export class SetAccountEmailValidatedStub implements SetAccountEmailValidated {
    async setEmailValidated(accountId: SetAccountEmailValidated.Params): Promise<SetAccountEmailValidated.Result> {
        return Promise.resolve(undefined)
    }

}