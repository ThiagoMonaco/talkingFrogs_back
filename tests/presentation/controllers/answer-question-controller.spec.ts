import { AnswerQuestionController } from '@presentation/controllers/answer-question-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { AnswerQuestionStub } from '@tests/domain/stubs/answer-question-stub'
import {
    mockAnswerQuestionControllerRequest
} from '@tests/presentation/mocks/controllers/answer-question-controller-mock'
import { QuestionNotFoundError } from '@presentation/errors'
import { badRequest, serverError } from '@presentation/helpers/http-helper'

interface SutTypes {
    sut: AnswerQuestionController
    validatorStub: ValidationStub
    answerQuestionStub: AnswerQuestionStub
}

const makeSut = (): SutTypes => {
    const validatorStub = new ValidationStub()
    const answerQuestionStub = new AnswerQuestionStub()
    const sut = new AnswerQuestionController(validatorStub, answerQuestionStub)
    return {
        sut,
        validatorStub,
        answerQuestionStub
    }
}

describe('AnswerQuestionController', () => {
    test('Should call validator with correct values', async () => {
        const { sut, validatorStub } = makeSut()
        const validateSpy = jest.spyOn(validatorStub, 'validate')
        const request = mockAnswerQuestionControllerRequest()

        await sut.handle(request)
        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test('Should return 400 if validator returns an error', async () => {
        const { sut, validatorStub } = makeSut()
        jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
        const request = mockAnswerQuestionControllerRequest()

        const response = await sut.handle(request)
        expect(response.statusCode).toBe(400)
    })

    test('Should call answerQuestion with correct values', async () => {
        const { sut, answerQuestionStub } = makeSut()
        const answerSpy = jest.spyOn(answerQuestionStub, 'answer')
        const request = mockAnswerQuestionControllerRequest()

        await sut.handle(request)
        expect(answerSpy).toHaveBeenCalledWith(request)
    })

    test('Should return 400 QuestionNotFoundError if answerQuestion returns false', async () => {
        const { sut, answerQuestionStub } = makeSut()
        answerQuestionStub.result = false
        const request = mockAnswerQuestionControllerRequest()

        const response = await sut.handle(request)
        expect(response).toEqual(badRequest(new QuestionNotFoundError()))
    })

    test('Should return 500 if answerQuestion throws', async () => {
        const { sut, answerQuestionStub } = makeSut()
        const error = new Error()
        jest.spyOn(answerQuestionStub, 'answer').mockImplementationOnce(() => {
            throw error
        })
        const request = mockAnswerQuestionControllerRequest()

        const response = await sut.handle(request)
        expect(response).toEqual(serverError(error))
    })
})