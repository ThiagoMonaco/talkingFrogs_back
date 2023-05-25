import { AnswerQuestionController } from '@presentation/controllers/answer-question-controller'
import { faker } from '@faker-js/faker'

export const mockAnswerQuestionControllerRequest = (): AnswerQuestionController.Request => ({
    answer: faker.lorem.sentence(),
    questionId: faker.datatype.uuid()
})