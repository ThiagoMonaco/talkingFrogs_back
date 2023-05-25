export interface CheckAccountByNameRepository {
    checkByName: (name: string) => Promise<CheckAccountByNameRepository.Result>
}

export namespace CheckAccountByNameRepository {
    export type Result = boolean
}