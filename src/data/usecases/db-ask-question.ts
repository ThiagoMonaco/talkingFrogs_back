import { AskQuestion } from '@domain/usecases/ask-question'
import { AddQuestionRepository } from '@data/protocols/db/question/add-question-repository'

export class DbAskQuestion implements AskQuestion {
    constructor(
        private readonly addQuestionRepository: AddQuestionRepository
    ) {}
    async ask(params: AskQuestion.Params): Promise<AskQuestion.Result> {
        return await this.addQuestionRepository.addQuestion(params)
    }
}