import { LoginController } from '@presentation/controllers/login-controller'
import { badRequest, ok, serverError, unauthorized } from '@presentation/helpers/http-helper'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { AuthenticationStub } from '@tests/domain/stubs/authentication-stub'
import { mockLoginControllerRequest } from '@tests/presentation/mocks/controllers/login-controller-mock'

interface SutTypes {
    sut: LoginController,
    validatorStub: ValidationStub,
    authenticationStub: AuthenticationStub
}


const makeSut = (): SutTypes => {
    const validatorStub = new ValidationStub()
    const authenticationStub = new AuthenticationStub()
    const sut = new LoginController(validatorStub, authenticationStub)
    return {
        sut,
        validatorStub,
        authenticationStub
    }
}


describe('Login Controller', () => {
    test('Should call authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()

        const spy = jest.spyOn(authenticationStub, 'auth')
        const request = mockLoginControllerRequest()
        await sut.handle(request)
        expect(spy).toHaveBeenCalledWith({
            email: request.email,
            password: request.password
        })
    })

    test('Should return 401 if authentication fails', async () => {
        const { sut, authenticationStub } = makeSut()

        authenticationStub.result = null

        const response = await sut.handle(mockLoginControllerRequest())
        expect(response).toEqual(unauthorized())
    })

    test('Should return 500 if authentication throws an error', async () => {
        const { sut, authenticationStub } = makeSut()

        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })

        const response = await sut.handle(mockLoginControllerRequest())
        expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 200 if authentication works correctly', async () => {
        const { sut, authenticationStub } = makeSut()

        const response = await sut.handle(mockLoginControllerRequest())

        expect(response).toEqual(ok({
            accessToken: authenticationStub.result.accessToken,
            name: authenticationStub.result.name
        }))
    })

    test('should return 400 if Validator returns a error', async() => {
        const { sut, validatorStub } = makeSut()
        validatorStub.result = new Error()
        const httpRequest = mockLoginControllerRequest()

        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(badRequest(new Error()))
    })
})