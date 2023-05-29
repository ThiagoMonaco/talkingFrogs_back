export interface SetAccountEmailValidated {
    setEmailValidated: (accountId: SetAccountEmailValidated.Params) => Promise<SetAccountEmailValidated.Result>
}

export namespace SetAccountEmailValidated {
    export type Params = string
    export type Result = boolean
}