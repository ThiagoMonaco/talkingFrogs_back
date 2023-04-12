import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { Authentication } from '@domain/usecases/authentication'
import { badRequest, ok, serverError, unauthorized } from '@presentation/helpers/http-helper'

export class LoginController implements Controller {
    private readonly validator: Validator
    private readonly authenticator: Authentication

    constructor(validator: Validator, authenticator: Authentication) {
        this.validator = validator
        this.authenticator = authenticator
    }

    async handle(request: LoginController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { email, password } = request

            const authenticationResult = await this.authenticator.auth({ email, password })
            if(!authenticationResult) {
                return unauthorized()
            }

            return ok({
                accessToken: authenticationResult.accessToken,
                name: authenticationResult.name
            })
        } catch (error) {
            return serverError(new Error(error))
        }
    }
}

export namespace LoginController {
    export type Request = {
        email: string
        password: string
    }
}