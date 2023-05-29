export interface SetAccountEmailValidatedRepository {
    setEmailValidated: (accountId: SetAccountEmailValidatedRepository.Params) => Promise<SetAccountEmailValidatedRepository.Result>
}

export namespace SetAccountEmailValidatedRepository {
    export type Params = string
    export type Result = boolean
}