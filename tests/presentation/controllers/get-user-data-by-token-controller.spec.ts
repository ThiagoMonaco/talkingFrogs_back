import { GetUserDataByTokenController } from '@presentation/controllers/get-user-data-by-token-controller'
import { faker } from '@faker-js/faker'
import { ok, serverError } from '@presentation/helpers/http-helper'

interface SutTypes {
	sut: GetUserDataByTokenController
}

const makeSut = (): SutTypes => {
	const sut = new GetUserDataByTokenController()
	return { sut }
}

const mockRequest = (): GetUserDataByTokenController.Request => ({
	isEmailVerified: true,
	accountEmail: faker.internet.email(),
	accountName: faker.name.firstName()
})

describe('GetUserDataByTokenController', () => {
	test('Should return 200 if succeeds', async () => {
		const { sut } = makeSut()
		const request = mockRequest()
		const response = await sut.handle(request)
		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			name: request.accountName,
			email: request.accountEmail,
			isEmailVerified: request.isEmailVerified
		})
	})
})