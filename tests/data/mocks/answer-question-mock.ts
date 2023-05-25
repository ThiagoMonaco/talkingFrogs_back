import { AnswerQuestion } from '@domain/usecases/answer-question'
import { faker } from '@faker-js/faker'

export const mockAnswerQuestionRequest = (): AnswerQuestion.Params => ({
    answer: faker.lorem.sentence(),
    questionId: faker.datatype.uuid()
})