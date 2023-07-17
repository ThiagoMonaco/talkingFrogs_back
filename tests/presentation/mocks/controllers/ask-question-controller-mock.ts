import { AskQuestionController } from '@presentation/controllers/ask-question-controller'
import { faker } from '@faker-js/faker'

export const mockAskQuestionControllerRequest = (): AskQuestionController.Request => ({
    question: faker.lorem.sentence(),
    name: faker.internet.userName()
})