import { Controller, HttpResponse } from '@presentation/protocols'
import { Validator } from '@presentation/helpers/validators'
import { badRequest, ok, serverError } from '@presentation/helpers/http-helper'
import { AskQuestion } from '@domain/usecases/ask-question'
import { UserNotFoundError } from '@presentation/errors'

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

            const { name, question } = request
            const response = await this.askQuestion.ask({ accountName: name, question })

            if(!response) {
                return badRequest(new UserNotFoundError())
            }

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
        name: string
        question: string
    }
}