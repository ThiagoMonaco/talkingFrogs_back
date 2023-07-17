import { Controller, HttpResponse } from '@presentation/protocols'
import { ok, serverError } from '@presentation/helpers/http-helper'

export class GetUserDataByTokenController implements Controller {
	async handle(request: GetUserDataByTokenController.Request): Promise<HttpResponse> {
		try {
			return ok({
				name: request.accountName,
				email: request.accountEmail,
			})
		} catch (error) {
			return serverError(error)
		}
	}
}

export namespace GetUserDataByTokenController {
	export type Request = {
		accountId: string
		accountEmail: string
		accountName: string
	}
}