import { SendEmailTokenController } from '@presentation/controllers/send-email-token-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { SendEmailStub } from '@tests/domain/stubs/send-email-stub'
import { GenerateEmailTokenStub } from '@tests/domain/stubs/generate-email-token-stub'
import { faker } from '@faker-js/faker'
import { ok, serverError } from '@presentation/helpers/http-helper'
import { CheckEmailExistsStub } from '@tests/domain/stubs/check-email-exists-stub'

interface SutTypes {
	sut: SendEmailTokenController
	validatorStub: ValidationStub
	sendEmailStub: SendEmailStub
	generateEmailTokenStub: GenerateEmailTokenStub
	checkEmailExistsStub: CheckEmailExistsStub
}

const makeSut = (): SutTypes => {
	const validator = new ValidationStub()
	const sendEmail = new SendEmailStub()
	const generateEmailToken = new GenerateEmailTokenStub()
	const checkEmailExists = new CheckEmailExistsStub()

	const sut = new SendEmailTokenController(
		validator,
		sendEmail,
		generateEmailToken,
		checkEmailExists
	)

	return {
		sut,
		validatorStub: validator,
		sendEmailStub: sendEmail,
		generateEmailTokenStub: generateEmailToken,
		checkEmailExistsStub: checkEmailExists
	}
}

const mockRequest = (): SendEmailTokenController.Request => ({
	email: faker.internet.email()
})

describe('SendEmailTokenController', () => {
	test('Should call validator with correct values', async () => {
		const { sut, validatorStub } = makeSut()
		const validateSpy = jest.spyOn(validatorStub, 'validate')
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(validateSpy).toHaveBeenCalledWith(httpRequest)
	})

	test('Should return 400 if validator returns an error', async () => {
		const { sut, validatorStub } = makeSut()
		jest.spyOn(validatorStub, 'validate').mockReturnValueOnce(new Error())
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
	})

	test('Should call generateEmailToken with correct values', async () => {
		const { sut, generateEmailTokenStub } = makeSut()
		const generateEmailTokenSpy = jest.spyOn(generateEmailTokenStub, 'generateEmailToken')
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(generateEmailTokenSpy).toHaveBeenCalledWith(httpRequest.email)
	})

	test('Should throw if generateEmailToken throws', async () => {
		const { sut, generateEmailTokenStub } = makeSut()
		jest.spyOn(generateEmailTokenStub, 'generateEmailToken').mockImplementationOnce(() => {
			throw new Error()
		})
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(serverError(new Error()))
	})

	test('Should call sendEmail with correct values', async () => {
		const { sut, sendEmailStub, generateEmailTokenStub } = makeSut()
		const sendEmailSpy = jest.spyOn(sendEmailStub, 'sendEmail')
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(sendEmailSpy).toHaveBeenCalledWith({
			to: httpRequest.email,
			subject: 'Talking Frogs - Email validation',
			text: `Hello, this is your email validation token: ${generateEmailTokenStub.result}`
		})
	})

	test('Should throw if sendEmail throws', async () => {
		const { sut, sendEmailStub } = makeSut()
		jest.spyOn(sendEmailStub, 'sendEmail').mockImplementationOnce(() => {
			throw new Error()
		})
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(serverError(new Error()))
	})

	test('Should return 200 on success', async () => {
		const { sut } = makeSut()
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(ok())
	})

	test('Should call checkEmailExists with correct values', async () => {
		const { sut, checkEmailExistsStub } = makeSut()
		const checkEmailExistsSpy = jest.spyOn(checkEmailExistsStub, 'checkEmailExists')
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(checkEmailExistsSpy).toHaveBeenCalledWith(httpRequest.email)
	})

	test('Should return 500 if checkEmailExists throws', async () => {
		const { sut, checkEmailExistsStub } = makeSut()
		jest.spyOn(checkEmailExistsStub, 'checkEmailExists').mockImplementationOnce(() => {
			throw new Error()
		})
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(serverError(new Error()))
	})

	test('should return 200 if email not exists', async () => {
		const { sut, checkEmailExistsStub } = makeSut()
		checkEmailExistsStub.result = false
		const httpRequest = mockRequest()

		const response = await sut.handle(httpRequest)

		expect(response).toEqual(ok())
	})


})