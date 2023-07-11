import { GetUserDataByName } from '@domain/usecases/get-user-data-by-name'
import { GetUserDataByNameRepository } from '@data/protocols/db/account/get-user-data-by-name-repository'

export class DbGetUserDataByName implements GetUserDataByName {
	constructor(
		private readonly getUserDataByNameRepository: GetUserDataByNameRepository
	) {}
	async getUserDataByName(accountName: string): Promise<GetUserDataByName.Result> {
		return this.getUserDataByNameRepository.getUserDataByName(accountName)
	}
}