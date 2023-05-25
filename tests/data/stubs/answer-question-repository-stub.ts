import { AnswerQuestionRepository } from '@data/protocols/db/question/answer-question-repository'

export class AnswerQuestionRepositoryStub implements AnswerQuestionRepository {
    result = true

    async answerQuestion(data: AnswerQuestionRepository.Params): Promise<AnswerQuestionRepository.Result> {
        return this.result
    }


}