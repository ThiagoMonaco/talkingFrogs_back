import { QuestionModel } from '@domain/models/question'

export interface GetUserDataByName {
	getUserDataByName: (accountName: string) => Promise<GetUserDataByName.Result>
}

export namespace GetUserDataByName {
	export type Result = {
		id: string
		name: string
		questions: QuestionModel[]
	}
}