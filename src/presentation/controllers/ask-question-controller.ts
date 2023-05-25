import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { AskQuestion } from '@domain/usecases/ask-question'

export class AskQuestionController implements Controller {
    private readonly validator: Validator
    private readonly askQuestion: AskQuestion

    constructor(validator: Validator, askQuestion: AskQuestion) {
        this.validator = validator
        this.askQuestion = askQuestion
    }

    async handle(request: AskQuestionController.Request): Promise<HttpResponse> {
        try {
            const error = this.validator.validate(request)
            if(error) {
                return badRequest(error)
            }

            const { targetAccountId, question } = request
            const response = await this.askQuestion.ask({ targetAccountId, question })

            return ok({
                questionId: response.questionId,
            })
        } catch (error) {
            return serverError(new Error(error))
        }
    }
}

export namespace AskQuestionController {
    export type Request = {
        targetAccountId: string
        question: string
    }
}