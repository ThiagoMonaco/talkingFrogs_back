export interface GenerateUuid {
    generate(): Promise<GenerateUuid.Result>
}

export namespace GenerateUuid {
    export type Result = string
}