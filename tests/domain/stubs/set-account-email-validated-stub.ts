import { SetAccountEmailValidated } from '@domain/usecases/set-account-email-validated'

export class SetAccountEmailValidatedStub implements SetAccountEmailValidated {
    result = true
    async setEmailValidated(accountId: SetAccountEmailValidated.Params): Promise<SetAccountEmailValidated.Result> {
        return this.result
    }

}