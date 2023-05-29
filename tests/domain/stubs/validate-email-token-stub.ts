import { ValidateEmailToken } from '@domain/usecases/validate-email-token'

export class ValidateEmailTokenStub implements ValidateEmailToken {
    result = true
    async validateEmailToken(data: ValidateEmailToken.Params): Promise<ValidateEmailToken.Result> {
        return this.result
    }
}