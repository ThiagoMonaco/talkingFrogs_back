import { Controller } from '@presentation/protocols/controller'
import { AddAccount } from '@domain/usecases/add-account'
import { HttpResponse } from '@presentation/protocols/http-response'
import { Validator } from '@presentation/helpers/validators/validator'
import { Authentication } from '@domain/usecases/authentication'
import { EmailAlreadyExistsError } from '@presentation/errors/email-already-exists-error'
import { badRequest, forbidden, ok, serverError } from '@presentation/helpers/http-helper'
import { NameAlreadyExistsError } from '@presentation/errors'
import { SendEmail } from '@domain/usecases/send-email'
import { GenerateEmailToken } from '@domain/usecases/generate-email-token'

export class SignupController implements Controller {
    constructor(
        private readonly addAccount: AddAccount,
        private readonly validator: Validator,
        private readonly authentication: Authentication,
        private readonly sendEmail: SendEmail,
        private readonly generateEmailToken: GenerateEmailToken
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
            const emailToken = await this.generateEmailToken.generateEmailToken(email)

            if(emailToken) {
                 this.sendEmail.sendEmail({
                    to: email,
                    subject: 'Talking Frogs - Email validation',
                    text: `Hello ${name}, this is your email validation token: ${emailToken}`
                })
            }

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