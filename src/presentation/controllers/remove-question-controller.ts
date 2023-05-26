import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { RemoveQuestion } from '@domain/usecases/remove-question'
import { QuestionNotFoundError } from '@presentation/errors'

export class RemoveQuestionController implements Controller {

    constructor (
        private readonly validator: Validator,
        private readonly removeQuestion: RemoveQuestion
    ) {}
    async handle(request: RemoveQuestionController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { questionId, accountId } = request

            const result = await this.removeQuestion.removeQuestion({ questionId, accountId })
            if(!result) {
                return badRequest(new QuestionNotFoundError())
            }

            return ok()
        } catch (error) {
            return serverError(new Error(error))
        }
    }

}

export namespace RemoveQuestionController {
    export type Request = {
        accountId: string
        questionId: string
    }
}