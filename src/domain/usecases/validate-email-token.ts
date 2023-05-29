export interface ValidateEmailToken {
    validateEmailToken: (request: ValidateEmailToken.Params) => Promise<ValidateEmailToken.Result>
}

export namespace ValidateEmailToken {
    export type Params = {
        token: string
        accountEmail: string
    }

    export type Result = boolean
}