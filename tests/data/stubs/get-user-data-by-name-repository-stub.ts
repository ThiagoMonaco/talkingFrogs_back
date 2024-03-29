import { GetUserDataByNameRepository } from '@data/protocols/db/account/get-user-data-by-name-repository'
import { GetUserDataByName } from '@domain/usecases/get-user-data-by-name'
import { faker } from '@faker-js/faker'
import { mockQuestionModel } from '@tests/domain/mocks/question-model-mock'

export class GetUserDataByNameRepositoryStub implements GetUserDataByNameRepository {
	result: GetUserDataByName.Result = {
		id: faker.name.firstName(),
		name: '',
		questions: [
			mockQuestionModel(),
			mockQuestionModel(),
		]
	}
	async getUserDataByName(accountName: string): Promise<GetUserDataByNameRepository.Result> {
		this.result.name = accountName
		return this.result
	}

}