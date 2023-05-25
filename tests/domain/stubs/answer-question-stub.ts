import { AnswerQuestion } from '@domain/usecases/answer-question'

export class AnswerQuestionStub implements AnswerQuestion {
    result = true
    async answer(data: AnswerQuestion.Params): Promise<AnswerQuestion.Result> {
        return this.result
    }
}