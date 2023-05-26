import { RemoveAnswerController } from '@presentation/controllers/remove-answer-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { AnswerQuestionStub } from '@tests/domain/stubs/answer-question-stub'
import { faker } from '@faker-js/faker'
import { QuestionNotFoundError } from '@presentation/errors'

interface SutTypes {
    sut: RemoveAnswerController
    validatorStub: ValidationStub
    answerQuestionStub: AnswerQuestionStub
}

const makeSut = (): SutTypes => {
    const validatorStub = new ValidationStub()
    const answerQuestionStub = new AnswerQuestionStub()
    const sut = new RemoveAnswerController(validatorStub, answerQuestionStub)
    return {
        sut,
        validatorStub,
        answerQuestionStub
    }
}

const mockRequest = (): RemoveAnswerController.Request => ({
    questionId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid()
})

describe('RemoveAnswerController', () => {
    test('Should call validator with correct values', async () => {
        const { sut, validatorStub } = makeSut()
        const validateSpy = jest.spyOn(validatorStub, 'validate')
        const request = mockRequest()
        await sut.handle(request)
        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test('Should return badRequest if validator returns an error', async () => {
        const { sut, validatorStub } = makeSut()
        validatorStub.result = new Error()
        const request = mockRequest()
        const response = await sut.handle(request)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual(new Error())
    })

    test('Should call answerQuestion with correct values', async () => {
        const { sut, answerQuestionStub } = makeSut()
        const answerSpy = jest.spyOn(answerQuestionStub, 'answer')
        const request = mockRequest()
        await sut.handle(request)
        expect(answerSpy).toHaveBeenCalledWith({
            questionId: request.questionId,
            accountId: request.accountId,
            answer: null
        })
    })

    test('Should return badRequest if answerQuestion returns false', async () => {
        const { sut, answerQuestionStub } = makeSut()
        answerQuestionStub.result = false
        const request = mockRequest()
        const response = await sut.handle(request)
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual(new QuestionNotFoundError())
    })

    test('Should return ok if answerQuestion returns true', async () => {
        const { sut } = makeSut()
        const request = mockRequest()
        const response = await sut.handle(request)
        expect(response.statusCode).toBe(200)
    })
})