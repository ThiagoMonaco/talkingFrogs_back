import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { AnswerQuestion } from '@domain/usecases/answer-question'
import { QuestionNotFoundError } from '@presentation/errors'


export class AnswerQuestionController implements Controller {
    constructor(
        private readonly validator: Validator,
        private readonly answerQuestion: AnswerQuestion
    ) {}

    async handle(request: AnswerQuestionController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { questionId, answer, accountId } = request

            const result = await this.answerQuestion.answer({ questionId, answer, accountId })
            if(!result) {
                return badRequest(new QuestionNotFoundError())
            }

            return ok()

        } catch (error) {
            return serverError(new Error(error))
        }
    }
}

export namespace AnswerQuestionController {
    export type Request = {
        questionId: string
        answer: string
        accountId: string
    }
}