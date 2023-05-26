export interface RemoveQuestion {
    removeQuestion: (params: RemoveQuestion.Params) => Promise<RemoveQuestion.Result>
}

export namespace RemoveQuestion {
    export type Params = {
        accountId: string
        questionId: string
    }

    export type Result = boolean
}