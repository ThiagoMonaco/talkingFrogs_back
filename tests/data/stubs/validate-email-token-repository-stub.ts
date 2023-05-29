import { ValidateEmailTokenRepository } from '@data/protocols/db/account/validate-email-token-repository'

export class ValidateEmailTokenRepositoryStub implements ValidateEmailTokenRepository {
    result = true
    async validateEmailToken(request: ValidateEmailTokenRepository.Params): Promise<ValidateEmailTokenRepository.Result> {
        return this.result
    }
}
