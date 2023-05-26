export interface RemoveQuestionRepository {
    removeQuestion: (data: RemoveQuestionRepository.Params) => Promise<RemoveQuestionRepository.Result>
}

export namespace RemoveQuestionRepository {
    export type Params = {
        accountId: string
        questionId: string
    }
    export type Result = boolean
}