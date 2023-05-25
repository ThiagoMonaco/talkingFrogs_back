import { AnswerQuestion } from '@domain/usecases/answer-question'
import { AnswerQuestionRepository } from '@data/protocols/db/question/answer-question-repository'

export class DbAnswerQuestion implements AnswerQuestion {
    constructor(
        private readonly answerQuestionRepository: AnswerQuestionRepository
    ) {}

    async answer(data: AnswerQuestion.Params): Promise<AnswerQuestion.Result> {
        return await this.answerQuestionRepository.answerQuestion(data)
    }
}
