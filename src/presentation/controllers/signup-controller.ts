import { Controller } from '@presentation/protocols/controller'
import { AddAccount } from '@domain/usecases/add-account'
import { HttpResponse } from '@presentation/protocols/http-response'
import { Validator } from '@presentation/helpers/validators/validator'
import { Authentication } from '@domain/usecases/authentication'
import { EmailAlreadyExistsError } from '@presentation/errors/email-already-exists-error'
import { badRequest, forbidden, ok, serverError } from '@presentation/helpers/http-helper'
import { NameAlreadyExistsError } from '@presentation/errors'

export class SignupController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validator: Validator,
        private readonly authentication: Authentication
    )
    {}

    async handle(request:SignUpController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { name, email, password } = request

            try {
                await this.addAccount.add({
                    name: name,
                    email: email,
                    password: password
                })
            } catch (error) {
                if(error instanceof EmailAlreadyExistsError ||
                   error instanceof NameAlreadyExistsError) {
                    return forbidden(error)
                }
                throw error
            }

            const authenticationResult = await this.authentication.auth({ email, password } )

            return ok(authenticationResult)
        } catch (error) {
            return serverError(error)
        }
    }
}

export namespace SignUpController {
    export type Request = {
        name: string
        email: string
        password: string
        passwordConfirmation: string
    }
}