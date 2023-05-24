import { AskQuestion } from '@domain/usecases/ask-question'

export class AskQuestionStub implements AskQuestion {
    async ask(question: AskQuestion.Params): Promise<AskQuestion.Result> {
        return Promise.resolve(undefined)
    }
}