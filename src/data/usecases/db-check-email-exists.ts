import { CheckEmailExists } from '@domain/usecases/check-email-exists'
import { CheckAccountByEmailRepository } from '@data/protocols/db/account/check-account-by-email-repository'

export class DbCheckEmailExists implements CheckEmailExists {
	constructor(
		private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
	) {}

	async checkEmailExists(email: CheckEmailExists.Request): Promise<CheckEmailExists.Result> {
		return await this.checkAccountByEmailRepository.checkByEmail(email)
	}

}