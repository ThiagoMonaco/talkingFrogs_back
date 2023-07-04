import { DbCheckEmailExists } from '@data/usecases/db-check-email-exists'
import { CheckAccountByEmailRepositoryStub } from '@tests/data/stubs/check-account-by-email-repository-stub'
import { faker } from '@faker-js/faker'

interface SutTypes {
	sut: DbCheckEmailExists
	checkAccountByEmailRepositoryStub: CheckAccountByEmailRepositoryStub
}

const makeSut = (): SutTypes => {
	const checkAccountByEmailRepositoryStub = new CheckAccountByEmailRepositoryStub()
	const sut = new DbCheckEmailExists(checkAccountByEmailRepositoryStub)
	return {
		sut,
		checkAccountByEmailRepositoryStub
	}
}

describe('DbCheckEmailExists Usecase', () => {
	test('should call CheckAccountByEmailRepository with correct email', async () => {
		const { sut, checkAccountByEmailRepositoryStub } = makeSut()
		const checkSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
		const email = faker.internet.email()

		await sut.checkEmailExists(email)

		expect(checkSpy).toHaveBeenCalledWith(email)
	})

	test('should return true if CheckAccountByEmailRepository returns true', async () => {
		const { sut, checkAccountByEmailRepositoryStub } = makeSut()
		checkAccountByEmailRepositoryStub.accountExists = true

		const email = faker.internet.email()

		const result = await sut.checkEmailExists(email)

		expect(result).toBeTruthy()
	})

	test('should return false if CheckAccountByEmailRepository returns false', async () => {
		const { sut  } = makeSut()
		const email = faker.internet.email()

		const result = await sut.checkEmailExists(email)

		expect(result).toBeFalsy()
	})

	test('should throw if CheckAccountByEmailRepository throws', async () => {
		const { sut, checkAccountByEmailRepositoryStub } = makeSut()
		jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockImplementationOnce(() => {
			throw new Error()
		})
		const email = faker.internet.email()

		const promise = sut.checkEmailExists(email)

		await expect(promise).rejects.toThrow()
	})
})