import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { AnswerQuestion } from '@domain/usecases/answer-question'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { QuestionNotFoundError } from '@presentation/errors'

export class RemoveAnswerController implements Controller {
    constructor(
        private readonly validator: Validator,
        private readonly answerQuestion: AnswerQuestion
    )
    {}

    async handle(request: RemoveAnswerController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { questionId, accountId } = request

            const result = await this.answerQuestion.answer({
                questionId,
                accountId,
                answer: null
            })

            if(!result) {
                return badRequest(new QuestionNotFoundError())
            }

            return ok()
        } catch (error) {
            return serverError(error)
        }
    }
}

export namespace RemoveAnswerController {
    export type Request = {
        questionId: string
        accountId: string
    }
}