import { DbGetUserDataByName } from '@data/usecases/db-get-user-data-by-name'
import { GetUserDataByNameRepositoryStub } from '@tests/data/stubs/get-user-data-by-name-repository-stub'
import { faker } from '@faker-js/faker'

interface SutTypes {
	sut: DbGetUserDataByName
	getUserDataByNameRepositoryStub: GetUserDataByNameRepositoryStub
}

const makeSut = (): SutTypes => {
	const getUserDataByNameRepositoryStub = new GetUserDataByNameRepositoryStub()
	const sut = new DbGetUserDataByName(getUserDataByNameRepositoryStub)
	return {
		sut,
		getUserDataByNameRepositoryStub
	}
}

describe('DbGetUserDataByName', () => {
	test('should call GetUserDataByNameRepository with correct values', async () => {
		const { sut, getUserDataByNameRepositoryStub } = makeSut()
		const getUserDataByNameSpy = jest.spyOn(getUserDataByNameRepositoryStub, 'getUserDataByName')
		const name = faker.internet.userName()

		await sut.getUserDataByName(name)
		expect(getUserDataByNameSpy).toHaveBeenCalledWith(name)
	})

	test('should throw if GetUserDataByNameRepository throws', async () => {
		const { sut, getUserDataByNameRepositoryStub } = makeSut()
		jest.spyOn(getUserDataByNameRepositoryStub, 'getUserDataByName').mockImplementationOnce(() => {
			throw new Error()
		})

		const promise = sut.getUserDataByName(faker.internet.userName())
		await expect(promise).rejects.toThrow()
	})

	test('should return null if GetUserDataByNameRepository returns null', async () => {
		const { sut, getUserDataByNameRepositoryStub } = makeSut()
		jest.spyOn(getUserDataByNameRepositoryStub, 'getUserDataByName').mockReturnValueOnce(null)

		const result = await sut.getUserDataByName(faker.internet.userName())
		expect(result).toBeNull()
	})

	test('should return an account on success', async () => {
		const { sut } = makeSut()

		const result = await sut.getUserDataByName(faker.internet.userName())
		expect(result).toBeTruthy()
	})
})