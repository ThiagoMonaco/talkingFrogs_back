import { AskQuestion } from '@domain/usecases/ask-question'
import { faker } from '@faker-js/faker'

export class AskQuestionStub implements AskQuestion {
    result = {
        questionId: faker.datatype.uuid()
    }
    async ask(question: AskQuestion.Params): Promise<AskQuestion.Result> {
        return this.result
    }
}