import { RemoveQuestionController } from '@presentation/controllers/remove-question-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { RemoveQuestionStub } from '@tests/domain/stubs/remove-question-stub'
import { RemoveQuestion } from '@domain/usecases/remove-question'
import { faker } from '@faker-js/faker'
import { QuestionNotFoundError } from '@presentation/errors'
import { serverError } from '@presentation/helpers/http-helper'

interface SutTypes {
    sut: RemoveQuestionController
    validationStub: ValidationStub
    removeQuestion: RemoveQuestionStub
}

const makeSut = (): SutTypes => {
    const validationStub = new ValidationStub()
    const removeQuestion = new RemoveQuestionStub()
    const sut = new RemoveQuestionController(validationStub, removeQuestion)
    return {
        sut,
        validationStub,
        removeQuestion
    }
}

const mockRequest = (): RemoveQuestion.Params => ({
    questionId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid()
})

describe('RemoveQuestionController', () => {
    test('Should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut()
        validationStub.result = new Error()

        const httpResponse = await sut.handle(mockRequest())

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error())
    })

    test('Should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const request = mockRequest()

        await sut.handle(request)

        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test('Should call removeQuestion with correct values', async () => {
        const { sut, removeQuestion } = makeSut()
        const removeSpy = jest.spyOn(removeQuestion, 'removeQuestion')
        const request = mockRequest()

        await sut.handle(request)

        expect(removeSpy).toHaveBeenCalledWith(request)
    })

    test('Should return 500 if removeQuestion throws', async () => {
        const { sut, removeQuestion } = makeSut()
        const error = new Error()
        jest.spyOn(removeQuestion, 'removeQuestion').mockImplementationOnce(() => {
            throw error
        })

        const httpResponse = await sut.handle(mockRequest())

        expect(httpResponse).toEqual(serverError(error))
    })

    test('Should return 200 if removeQuestion succeeds', async () => {
        const { sut } = makeSut()
        const request = mockRequest()

        const httpResponse = await sut.handle(request)

        expect(httpResponse.statusCode).toBe(200)
    })

    test('Should return 400 QuestionNotFound if removeQuestion returns false', async () => {
        const { sut, removeQuestion } = makeSut()
        removeQuestion.result = false
        const request = mockRequest()

        const response = await sut.handle(request)

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual(new QuestionNotFoundError())
    })

})