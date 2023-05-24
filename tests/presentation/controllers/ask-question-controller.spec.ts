import { AskQuestionController } from '@presentation/controllers/ask-question-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { AskQuestionStub } from '@tests/domain/stubs/ask-question-stub'
import { mockAskQuestionControllerRequest } from '@tests/presentation/mocks/controllers/ask-question-controller-mock'
import { badRequest } from '@presentation/helpers/http-helper'
import { ServerError } from '@presentation/errors'

interface SutTypes {
    sut: AskQuestionController
    validatorStub: ValidationStub
    askQuestionStub: AskQuestionStub
}

const makeSut = (): SutTypes => {
    const validatorStub = new ValidationStub()
    const askQuestionStub = new AskQuestionStub()
    const sut = new AskQuestionController(validatorStub, askQuestionStub)
    return {
        sut,
        validatorStub,
        askQuestionStub
    }
}

describe('AskQuestionController', () => {
    test('Should call validator with correct params', async () => {
        const { sut, validatorStub } = makeSut()
        const validateSpy = jest.spyOn(validatorStub, 'validate')
        const request = mockAskQuestionControllerRequest()

        await sut.handle(request)

        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test('Should return 400 if validator returns an error', async () => {
        const { sut, validatorStub } = makeSut()
        validatorStub.result = new Error()
        const request = mockAskQuestionControllerRequest()

        const response = await sut.handle(request)

        expect(response).toEqual(badRequest(validatorStub.result))
    })

    test('Should call askQuestion with correct params', async () => {
        const { sut, askQuestionStub } = makeSut()
        const askSpy = jest.spyOn(askQuestionStub, 'ask')
        const request = mockAskQuestionControllerRequest()
        const expectedParams: AskQuestionController.Request = {
            targetAccountId: request.targetAccountId,
            accountId: request.accountId,
            question: request.question
        }

        await sut.handle(request)

        expect(askSpy).toHaveBeenCalledWith(expectedParams)
    })

    test('Should return 500 if askQuestion throws', async () => {
        const { sut, askQuestionStub } = makeSut()
        const error = new Error()
        jest.spyOn(askQuestionStub, 'ask').mockImplementationOnce(() => {
            throw error
        })
        const request = mockAskQuestionControllerRequest()

        const response = await sut.handle(request)

        expect(response.statusCode).toBe(500)
        expect(response.body).toEqual(new ServerError(error.stack))
    })
})