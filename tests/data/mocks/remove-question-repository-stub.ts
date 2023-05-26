import { RemoveQuestionRepository } from '@data/protocols/db/question/remove-question-repository'

export class RemoveQuestionRepositoryStub implements RemoveQuestionRepository {
    result = true
    async removeQuestion(data: RemoveQuestionRepository.Params): Promise<RemoveQuestionRepository.Result> {
        return this.result
    }

}