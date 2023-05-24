export interface AddQuestionRepository {
    add: (account: AddQuestionRepository.Params) => Promise<AddQuestionRepository.Result>
}

export namespace AddQuestionRepository {
    export type Params = {
        targetAccountId: string
        accountId: string
        question: string
    }

    export type Result = {
        questionId: string
    }
}