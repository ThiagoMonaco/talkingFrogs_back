import { QuestionModel } from '@domain/models/question'

export interface GetUserDataByNameRepository {
	getUserDataByName: (accountName: string) => Promise<GetUserDataByNameRepository.Result>
}

export namespace GetUserDataByNameRepository {
	export type Result = {
		accountId: string
		accountName: string
		questions: QuestionModel[]
	}
}