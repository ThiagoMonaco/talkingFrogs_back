import { Controller, HttpResponse } from '@presentation/protocols'
import { SendEmail } from '@domain/usecases/send-email'
import { GenerateEmailToken } from '@domain/usecases/generate-email-token'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { Validator } from '@presentation/helpers/validators'
import { CheckEmailExists } from '@domain/usecases/check-email-exists'

export class SendEmailTokenController implements Controller {
	constructor(
		private readonly validator: Validator,
		private readonly sendEmail: SendEmail,
		private readonly generateEmailToken: GenerateEmailToken,
		private readonly checkEmailExists: CheckEmailExists
	) {}

	async handle(request: SendEmailTokenController.Request): Promise<HttpResponse> {
		try {
			const error = this.validator.validate(request)
			if(error) {
				return badRequest(error)
			}

			const { email } = request

			const emailExists = await this.checkEmailExists.checkEmailExists(email)
			if(!emailExists) {
				return ok()
			}

			const emailToken = await this.generateEmailToken.generateEmailToken(email)

			if(emailToken) {
				await this.sendEmail.sendEmail({
					to: email,
					subject: 'Talking Frogs - Email validation',
					text: `Hello, this is your email validation token: ${emailToken}`
				})
			}

			return ok()
		} catch (error) {
			return serverError(error)
		}
	}
}

export namespace SendEmailTokenController {
	export interface Request {
		email: string
	}
}