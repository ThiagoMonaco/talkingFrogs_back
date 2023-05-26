import { QuestionModel } from '@domain/models/question'
import { faker } from '@faker-js/faker'

export const mockQuestionModel = (): QuestionModel => ({
    answer: faker.lorem.sentence(),
    questionId: faker.datatype.uuid(),
    question: faker.lorem.sentence()
})