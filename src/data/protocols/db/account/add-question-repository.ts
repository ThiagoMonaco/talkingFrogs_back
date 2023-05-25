export interface AddQuestionRepository {
    addQuestion: (account: AddQuestionRepository.Params) => Promise<AddQuestionRepository.Result>
}

export namespace AddQuestionRepository {
    export type Params = {
        accountName: string
        question: string
    }

    export type Result = {
        questionId: string
    }
}