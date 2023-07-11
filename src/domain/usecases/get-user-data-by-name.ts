import { QuestionModel } from '@domain/models/question'

export interface GetUserDataByName {
	getUserDataByName: (accountName: string) => Promise<GetUserDataByName.Result>
}

export namespace GetUserDataByName {
	export type Result = {
		accountId: string
		accountName: string
		questions: QuestionModel[]
	}
}