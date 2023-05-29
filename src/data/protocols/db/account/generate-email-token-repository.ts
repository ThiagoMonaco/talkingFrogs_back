export interface GenerateEmailTokenRepository {
    generate: (data: GenerateEmailTokenRepository.Params) => Promise<GenerateEmailTokenRepository.Result>
}

export namespace GenerateEmailTokenRepository {
    export type Params = {
        uuid: string
        email: string
    }
    export type Result = string
}