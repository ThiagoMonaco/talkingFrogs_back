export interface GenerateEmailToken {
    generateEmailToken: (email: GenerateEmailToken.Params) => Promise<GenerateEmailToken.Result>
}

export namespace GenerateEmailToken {
    export type Params = string
    export type Result = string
}