export interface AnswerQuestionRepository {
    answerQuestion: (account: AnswerQuestionRepository.Params) => Promise<AnswerQuestionRepository.Result>
}

export namespace AnswerQuestionRepository {
    export type Params = {
        questionId: string
        answer: string
        accountId: string
    }

    export type Result = boolean
}