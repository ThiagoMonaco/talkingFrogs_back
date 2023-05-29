import { ValidateEmailToken } from '@domain/usecases/validate-email-token'
import { ValidateEmailTokenRepository } from '@data/protocols/db/account/validate-email-token-repository'

export class DbValidateEmailToken implements ValidateEmailToken {

    constructor(
        private readonly validateEmailTokenRepository: ValidateEmailTokenRepository
    ) {}
    async validateEmailToken(request: ValidateEmailToken.Params): Promise<ValidateEmailToken.Result> {
        return await this.validateEmailTokenRepository.validateEmailToken(request)
    }

}