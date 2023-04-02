export interface AddAccountRepository {
    add: (account: AddAccountRepository.Params) => Promise<AddAccountRepository.Result>
}

export namespace AddAccountRepository {
    export type Params = {
        name: string
        email: string
        password: string
    }

    export type Result = {
        name: string
    }
}