import { GetUserDataController } from '@presentation/controllers/get-user-data-controller'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'
import { faker } from '@faker-js/faker'
import { GetUserDataByNameStub } from '@tests/domain/stubs/get-user-data-by-name-stub'
import { UserNotFoundError } from '@presentation/errors'
import { badRequest, serverError } from '@presentation/helpers/http-helper'

interface SutTypes {
	sut: GetUserDataController
	validatorStub: ValidationStub
	getUserDataByNameStub: GetUserDataByNameStub
}

const makeSut = (): SutTypes => {
	const validatorStub = new ValidationStub()
	const getUserDataByNameStub = new GetUserDataByNameStub()
	const sut = new GetUserDataController(validatorStub, getUserDataByNameStub)
	return {
		sut,
		validatorStub,
		getUserDataByNameStub
	}
}

const mockRequest = (): GetUserDataController.Request => ({
	accountName: faker.name.firstName()
})

describe('GetUserDataController', () => {
	test('Should call validator with correct values', async () => {
		const { sut, validatorStub } = makeSut()
		const validatorSpy = jest.spyOn(validatorStub, 'validate')
		const httpRequest = mockRequest()

		await sut.handle(httpRequest)

		expect(validatorSpy).toHaveBeenCalledWith(httpRequest)
	})

	test('Should return 400 if validator returns an error', async () => {
		const { sut, validatorStub } = makeSut()
		validatorStub.result = new Error()
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error())
	})

	test('Should call GetUserDataByName with correct values', async () => {
		const { sut, getUserDataByNameStub } = makeSut()
		const httpRequest = mockRequest()
		const getUserDataByNameSpy = jest.spyOn(getUserDataByNameStub, 'getUserDataByName')

		await sut.handle(httpRequest)

		expect(getUserDataByNameSpy).toHaveBeenCalledWith(httpRequest.accountName)
	})

	test('Should return 200 with userData when GetUserDataByName returns a user', async () => {
		const { sut, getUserDataByNameStub } = makeSut()
		const httpRequest = mockRequest()

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(200)
		expect(httpResponse.body).toEqual(getUserDataByNameStub.result)
	})

	test('Should return 500 if GetUserDataByName throws', async () => {
		const { sut, getUserDataByNameStub } = makeSut()
		const httpRequest = mockRequest()
		jest.spyOn(getUserDataByNameStub, 'getUserDataByName').mockImplementationOnce(() => {
			throw new Error()
		})

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(serverError(new Error()))
	})

	test('Should return 400 if GetUserDataByName returns null', async () => {
		const { sut, getUserDataByNameStub } = makeSut()
		const httpRequest = mockRequest()
		getUserDataByNameStub.result = null

		const httpResponse = await sut.handle(httpRequest)

		expect(httpResponse).toEqual(badRequest(new UserNotFoundError()))
	})

})