export interface AskQuestion {
    ask: (question: AskQuestion.Params) => Promise<AskQuestion.Result>
}

export namespace AskQuestion {
    export type Params = {
        targetAccountId: string
        accountId: string
        question: string
    }

    export type Result = void
}