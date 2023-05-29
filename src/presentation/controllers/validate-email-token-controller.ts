import { Controller, HttpResponse } from '@presentation/protocols'
import { ValidateEmailToken } from '@domain/usecases/validate-email-token'
import { badRequest, notFound, ok, serverError } from '@presentation/helpers/http-helper'
import { InvalidTokenError, UserNotFoundError } from '@presentation/errors'
import { Validator } from '@presentation/helpers/validators'
import { SetAccountEmailValidated } from '@domain/usecases/set-account-email-validated'

export class ValidateEmailTokenController implements Controller {

    constructor(
        private readonly validator: Validator,
        private readonly validateEmailToken: ValidateEmailToken,
        private readonly setAccountEmailValidated: SetAccountEmailValidated
    ) {}

    async handle(request: ValidateEmailTokenController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { token, accountEmail, accountId } = request
            const isValid = await this.validateEmailToken.validateEmailToken({ token, accountEmail })
            if(!isValid) {
                return badRequest(new InvalidTokenError())
            }

            const isAccountUpdated = await this.setAccountEmailValidated.setEmailValidated(accountId)
            if(!isAccountUpdated) {
                return notFound(new UserNotFoundError())
            }

            return ok()
        } catch (error) {
            return serverError(error)
        }
    }

}

export namespace ValidateEmailTokenController {
    export interface Request {
        token: string,
        accountEmail: string,
        accountId: string
    }
}