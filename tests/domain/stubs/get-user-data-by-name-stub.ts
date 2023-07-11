import { GetUserDataByName } from '@domain/usecases/get-user-data-by-name'
import { mockQuestionModel } from '@tests/domain/mocks/question-model-mock'
import { faker } from '@faker-js/faker'

export class GetUserDataByNameStub implements GetUserDataByName {
	result: GetUserDataByName.Result = {
		accountId: faker.name.firstName(),
		accountName: '',
		questions: [
			mockQuestionModel(),
			mockQuestionModel(),
		]
	}
	async getUserDataByName(accountName: string): Promise<GetUserDataByName.Result> {
		this.result.accountName = accountName
		return this.result
	}

}