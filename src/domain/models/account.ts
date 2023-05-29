import { QuestionModel } from '@domain/models/question'

export interface AccountModel {
    id: string
    name: string
    email: string
    password: string
    isEmailVerified: boolean
    questions: QuestionModel[]
    accessToken?: string
}
