export interface AnswerQuestion {
    answer: (data: AnswerQuestion.Params) => Promise<AnswerQuestion.Result>
}

export namespace AnswerQuestion {
    export type Params = {
        questionId: string
        answer: string
    }

    export type Result = boolean
}