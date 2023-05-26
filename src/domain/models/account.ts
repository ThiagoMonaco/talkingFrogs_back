import { QuestionModel } from '@domain/models/question'

export interface AccountModel {
    id: string
    name: string
    email: string
    password: string
    questions: QuestionModel[]
    accessToken?: string
}
