import { ValidateEmailTokenController } from '@presentation/controllers/validate-email-token-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { ValidateEmailTokenStub } from '@tests/domain/stubs/validate-email-token-stub'
import { faker } from '@faker-js/faker'
import { badRequest, notFound, serverError } from '@presentation/helpers/http-helper'
import { InvalidTokenError, UserNotFoundError } from '@presentation/errors'
import { SetAccountEmailValidatedStub } from '@tests/domain/stubs/set-account-email-validated-stub'

interface SutTypes {
    sut: ValidateEmailTokenController,
    validatorStub: ValidationStub,
    validateEmailTokenStub: ValidateEmailTokenStub,
    setAccountEmailValidatedStub: SetAccountEmailValidatedStub
}

const makeSut = (): SutTypes => {
    const validatorStub = new ValidationStub()
    const validateEmailTokenStub = new ValidateEmailTokenStub()
    const setAccountEmailValidatedStub = new SetAccountEmailValidatedStub()

    const sut = new ValidateEmailTokenController(
        validatorStub,
        validateEmailTokenStub,
        setAccountEmailValidatedStub)
    return {
        sut,
        validatorStub,
        validateEmailTokenStub,
        setAccountEmailValidatedStub
    }
}

const mockRequest = (): ValidateEmailTokenController.Request => ({
    accountEmail: faker.internet.email(),
    token: faker.datatype.uuid(),
    accountId: faker.datatype.uuid()
})

describe('ValidateEmailTokenController', () => {
    test('should call validator with correct values', async () => {
        const { sut, validatorStub } = makeSut()
        const validateSpy = jest.spyOn(validatorStub, 'validate')
        const request = mockRequest()

        await sut.handle(request)

        expect(validateSpy).toHaveBeenCalledWith(request)
    })

    test('should return 400 if validator returns an error', async () => {
        const { sut, validatorStub } = makeSut()
        validatorStub.result = new Error()
        const request = mockRequest()

        const response = await sut.handle(request)

        expect(response).toEqual(badRequest(new Error()))
    })

    test('should call validateEmailToken with correct values', async () => {
        const { sut, validateEmailTokenStub } = makeSut()
        const validateSpy = jest.spyOn(validateEmailTokenStub, 'validateEmailToken')
        const request = mockRequest()

        await sut.handle(request)

        expect(validateSpy).toHaveBeenCalledWith({ token: request.token, accountEmail: request.accountEmail })
    })

    test('should return 400 InvalidTokenError if validateEmailToken returns false', async () => {
        const { sut, validateEmailTokenStub } = makeSut()
        validateEmailTokenStub.result = false
        const request = mockRequest()

        const response = await sut.handle(request)

        expect(response).toEqual(badRequest(new InvalidTokenError()))
    })

    test('should return 500 if validateEmailToken throws', async () => {
        const { sut, validateEmailTokenStub } = makeSut()
        const error = new Error()
        jest.spyOn(validateEmailTokenStub, 'validateEmailToken').mockImplementationOnce(() => {
            throw error
        })
        const request = mockRequest()

        const response = await sut.handle(request)

        expect(response).toEqual(serverError(error))
    })

    test('should call setAccountEmailValidated with correct values', async () => {
        const { sut, setAccountEmailValidatedStub } = makeSut()
        const setSpy = jest.spyOn(setAccountEmailValidatedStub, 'setEmailValidated')
        const request = mockRequest()

        await sut.handle(request)

        expect(setSpy).toHaveBeenCalledWith(request.accountId)
    })

    test('should return 500 if setAccountEmailValidated throws', async () => {
        const { sut, setAccountEmailValidatedStub } = makeSut()
        const error = new Error()
        jest.spyOn(setAccountEmailValidatedStub, 'setEmailValidated').mockImplementationOnce(() => {
            throw error
        })
        const request = mockRequest()

        const response = await sut.handle(request)

        expect(response).toEqual(serverError(error))
    })

    test('should return 404 if setAccountEmailValidated returns false', async () => {
        const { sut, setAccountEmailValidatedStub } = makeSut()
        setAccountEmailValidatedStub.result = false
        const request = mockRequest()

        const response = await sut.handle(request)

        expect(response).toEqual(notFound(new UserNotFoundError()))
    })
})