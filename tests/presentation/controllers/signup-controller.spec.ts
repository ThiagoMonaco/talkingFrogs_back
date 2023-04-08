import { SignupController } from '@presentation/controllers/signup/signup-controller'
import { AddAccountStub } from '@tests/domain/stubs/add-account-stub'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { AuthenticationStub } from '@tests/domain/stubs/authentication-stub'
import { mockSignUpControllerRequest } from '@tests/presentation/mocks/controllers/signup-controller-mock'
import { badRequest, forbidden, serverError } from '@presentation/helpers/http-helper'
import { EmailAlreadyExistsError } from '@presentation/errors'

interface SutType {
    sut: SignupController,
    addAccountStub: AddAccountStub,
    validatorStub: ValidationStub,
    authenticationStub: AuthenticationStub
}

const createSut = (): SutType => {
    const addAccountStub = new AddAccountStub()
    const validatorStub = new ValidationStub()
    const authenticationStub = new AuthenticationStub()
    const sut = new SignupController(addAccountStub, validatorStub, authenticationStub)

    return {
        sut,
        addAccountStub,
        validatorStub,
        authenticationStub
    }
}

describe('SignUp Controller', () => {

    test('Should call authentication with correct values', async () => {
        const { sut, authenticationStub } = createSut()
        const spy = jest.spyOn(authenticationStub, 'auth')
        const request = mockSignUpControllerRequest()

        await sut.handle(request)

        expect(spy).toHaveBeenCalledWith({
            email: request.email,
            password: request.password
        })
    })

    test('Should return 500 if authentication throws an error', async () => {
        const { sut, authenticationStub } = createSut()
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })

        const response = await sut.handle(mockSignUpControllerRequest())

        expect(response).toEqual(serverError(new Error()))
    })

    test('should return 403 if addAccount returns false', async () => {
        const { sut, addAccountStub } = createSut()
        addAccountStub.result = false

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse).toEqual(forbidden(new EmailAlreadyExistsError()))
    })

    test('should call addAccount with 200 if correct data is provided', async() => {
        const { sut, addAccountStub, authenticationStub } = createSut()
        const addAccountSpy = jest.spyOn(addAccountStub, 'add')
        const httpRequest = mockSignUpControllerRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(addAccountSpy).toHaveBeenCalledWith({
            name: httpRequest.name,
            email: httpRequest.email,
            password: httpRequest.password
        })
        expect(httpResponse.body).toEqual({
            accessToken: authenticationStub.result.accessToken,
            name: authenticationStub.result.name
        })
    })

    test('should return 500 if addAccount throws error', async() => {
        const { sut, addAccountStub } = createSut()
        const error = new Error()
        error.stack = 'stack'
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            throw error
        })

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse).toEqual(serverError(error))
    })

    test('should call Validator with correct params', async() => {
        const { sut, validatorStub } = createSut()
        const spy = jest.spyOn(validatorStub, 'validate')
        const httpRequest = mockSignUpControllerRequest()

        await sut.handle(httpRequest)

        expect(spy).toHaveBeenCalledWith(httpRequest)
    })

    test('should return 400 if Validator returns a error', async() => {
        const { sut, validatorStub } = createSut()
        validatorStub.result = new Error()
        const httpRequest = mockSignUpControllerRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse).toEqual(badRequest(new Error()))
    })

})