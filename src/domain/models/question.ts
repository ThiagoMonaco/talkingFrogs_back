import { ObjectId } from 'mongodb'

export interface QuestionModel {
    question: string
    questionId: string
    answer: string | null
}