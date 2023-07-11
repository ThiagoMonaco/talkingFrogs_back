import { GetUserDataByName } from '@domain/usecases/get-user-data-by-name'
import { mockQuestionModel } from '@tests/domain/mocks/question-model-mock'
import { faker } from '@faker-js/faker'

export class GetUserDataByNameStub implements GetUserDataByName {
	result: GetUserDataByName.Result = {
		id: faker.name.firstName(),
		name: '',
		questions: [
			mockQuestionModel(),
			mockQuestionModel(),
		]
	}
	async getUserDataByName(accountName: string): Promise<GetUserDataByName.Result> {
		if(!this.result) {
			return this.result
		}
		this.result.name = accountName
		return this.result
	}

}