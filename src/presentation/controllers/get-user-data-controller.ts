import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { GetUserDataByName } from '@domain/usecases/get-user-data-by-name'

export class GetUserDataController implements Controller {
	constructor(
		private readonly validator: Validator,
		private readonly getUserDataByName: GetUserDataByName// GetUserDataByName
	) {}

	async handle(request: GetUserDataController.Request): Promise<HttpResponse> {
		try {
			const error = this.validator.validate(request)
			if (error) {
				return badRequest(error)
			}
			const userData = await this.getUserDataByName.getUserDataByName(request.accountName)
			return ok(userData)
		} catch (error) {
			return serverError(error)
		}
	}
}

export namespace GetUserDataController {
	export type Request = {
		accountName: string
	}
}