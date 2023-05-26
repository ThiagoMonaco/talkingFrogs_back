import { RemoveQuestion } from '@domain/usecases/remove-question'

export class RemoveQuestionStub implements RemoveQuestion {
    result = true
    async removeQuestion (data: RemoveQuestion.Params): Promise<RemoveQuestion.Result> {
        return this.result
    }
}