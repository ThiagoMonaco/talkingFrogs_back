import { AskQuestion } from '@domain/usecases/ask-question'
import { faker } from '@faker-js/faker'

export const mockAskQuestionParams = (): AskQuestion.Params => ({
    question: faker.lorem.sentence(),
    accountName: faker.internet.userName()
})