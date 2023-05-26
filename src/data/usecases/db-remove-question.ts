import { RemoveQuestion } from '@domain/usecases/remove-question'
import { RemoveQuestionRepository } from '@data/protocols/db/question/remove-question-repository'

export class DbRemoveQuestion implements RemoveQuestion {
    constructor (
        private readonly removeQuestionRepository: RemoveQuestionRepository
    ) {}

    async removeQuestion (data: RemoveQuestion.Params): Promise<RemoveQuestion.Result> {
        return await this.removeQuestionRepository.removeQuestion(data)
    }
}