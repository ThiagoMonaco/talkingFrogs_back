export interface AskQuestion {
    ask: (question: AskQuestion.Params) => Promise<AskQuestion.Result>
}

export namespace AskQuestion {
    export type Params = {
        accountName: string
        question: string
    }

    export type Result = {
        questionId: string
    }
}