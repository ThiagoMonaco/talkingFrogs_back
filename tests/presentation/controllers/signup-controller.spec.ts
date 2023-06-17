import { SignupController } from '@presentation/controllers/signup-controller'
import { AddAccountStub } from '@tests/domain/stubs/add-account-stub'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { AuthenticationStub } from '@tests/domain/stubs/authentication-stub'
import { mockSignUpControllerRequest } from '@tests/presentation/mocks/controllers/signup-controller-mock'
import { badRequest, forbidden, serverError } from '@presentation/helpers/http-helper'
import { EmailAlreadyExistsError, NameAlreadyExistsError } from '@presentation/errors'
import { SendEmailStub } from '@tests/domain/stubs/send-email-stub'
import { GenerateEmailTokenStub } from '@tests/domain/stubs/generate-email-token-stub'

interface SutType {
    sut: SignupController,
    addAccountStub: AddAccountStub,
    validatorStub: ValidationStub,
    authenticationStub: AuthenticationStub,
    sendEmailStub: SendEmailStub,
    generateEmailTokenStub: GenerateEmailTokenStub
}

const createSut = (): SutType => {
    const addAccountStub = new AddAccountStub()
    const validatorStub = new ValidationStub()
    const authenticationStub = new AuthenticationStub()
    const sendEmailStub = new SendEmailStub()
    const generateEmailTokenStub = new GenerateEmailTokenStub()
    const sut = new SignupController(
        addAccountStub,
        validatorStub,
        authenticationStub,
        sendEmailStub,
        generateEmailTokenStub)

    return {
        sut,
        addAccountStub,
        validatorStub,
        authenticationStub,
        sendEmailStub,
        generateEmailTokenStub
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

    test('should return 403 if addAccount throws EmailAlreadyExistsError', async () => {
        const { sut, addAccountStub } = createSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new EmailAlreadyExistsError() })

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse).toEqual(forbidden(new EmailAlreadyExistsError()))
    })

    test('should return 403 if addAccount throw NameAlreadyExistsError', async () => {
        const { sut, addAccountStub } = createSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new NameAlreadyExistsError() })

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse).toEqual(forbidden(new NameAlreadyExistsError()))
    })

    test('should return 500 if addAccount throws a unknown error', async () => {
        const { sut, addAccountStub } = createSut()
        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
    })

    test('should call addAccount with 200 if correct data is provided', async() => {
        const { sut, addAccountStub, authenticationStub } = createSut()
        authenticationStub.result.isEmailVerified = false
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
            name: authenticationStub.result.name,
            isEmailVerified: authenticationStub.result.isEmailVerified
        })

        expect(httpResponse.cookies).toEqual([{
            name: 'x-access-token',
            value: authenticationStub.result.accessToken,
            maxAge: 86400
        }])
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

    test('should call SendEmailUsecase with correct params', async() => {
        const { sut, sendEmailStub } = createSut()
        const spy = jest.spyOn(sendEmailStub, 'sendEmail')
        const httpRequest = mockSignUpControllerRequest()

        await sut.handle(httpRequest)

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ to: httpRequest.email }))
    })

    test('should return 500 if SendEmailUsecase throws error', async() => {
        const { sut, sendEmailStub } = createSut()
        const error = new Error()
        error.stack = 'stack'
        jest.spyOn(sendEmailStub, 'sendEmail').mockImplementationOnce(() => {
            throw error
        })

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse).toEqual(serverError(error))
    })

    test('should call GenerateEmailToken with correct params', async() => {
        const { sut, generateEmailTokenStub } = createSut()
        const spy = jest.spyOn(generateEmailTokenStub, 'generateEmailToken')
        const httpRequest = mockSignUpControllerRequest()

        await sut.handle(httpRequest)

        expect(spy).toHaveBeenCalledWith(httpRequest.email)
    })

    test('should return 500 if GenerateEmailToken throws error', async() => {
        const { sut, generateEmailTokenStub } = createSut()
        const error = new Error()
        error.stack = 'stack'
        jest.spyOn(generateEmailTokenStub, 'generateEmailToken').mockImplementationOnce(() => {
            throw error
        })

        const httpResponse = await sut.handle(mockSignUpControllerRequest())

        expect(httpResponse).toEqual(serverError(error))
    })

    test('should return 200 but dont send email if generateEmailToken return null', async() => {
        const { sut, sendEmailStub, generateEmailTokenStub } = createSut()
        generateEmailTokenStub.result = null
        const spy = jest.spyOn(sendEmailStub, 'sendEmail')
        const httpRequest = mockSignUpControllerRequest()

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(spy).not.toHaveBeenCalled()
    })

})