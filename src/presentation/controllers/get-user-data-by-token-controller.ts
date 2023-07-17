import { Controller, HttpResponse } from '@presentation/protocols'
import { ok } from '@presentation/helpers/http-helper'

export class GetUserDataByTokenController implements Controller {
	async handle(request: GetUserDataByTokenController.Request): Promise<HttpResponse> {
		console.log(request)
		return ok({
			name: request.accountName,
			email: request.accountEmail,
		})
	}
}

export namespace GetUserDataByTokenController {
	export type Request = {
		accountId: string
		accountEmail: string
		accountName: string
	}
}