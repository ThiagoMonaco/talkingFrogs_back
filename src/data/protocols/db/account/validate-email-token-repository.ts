export interface ValidateEmailTokenRepository {
    validateEmailToken: (request: ValidateEmailTokenRepository.Params) => Promise<ValidateEmailTokenRepository.Result>
}

export namespace ValidateEmailTokenRepository {
    export type Params = {
        token: string,
        accountEmail: string
    }
    export type Result = boolean
}