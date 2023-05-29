import { DbGenerateEmailToken } from '@data/usecases/db-generate-email-token'
import { GenerateUuidStub } from '@tests/data/stubs/generate-uuid-stub'
import { GenerateEmailTokenRepositoryStub } from '@tests/data/stubs/generate-email-token-repository-stub'
import { faker } from '@faker-js/faker'

interface SutTypes {
    sut: DbGenerateEmailToken
    generateEmailTokenRepositoryStub: GenerateEmailTokenRepositoryStub
    generateUuidStub: GenerateUuidStub
}

const makeSut = (): SutTypes => {
    const generateEmailTokenRepositoryStub = new GenerateEmailTokenRepositoryStub()
    const generateUuidStub = new GenerateUuidStub()
    const sut = new DbGenerateEmailToken(generateEmailTokenRepositoryStub, generateUuidStub)
    return {
        sut,
        generateEmailTokenRepositoryStub,
        generateUuidStub
    }
}

describe('DbGenerateEmailToken Usecase', () => {

    test('Should return null generateUuid return null', async () => {
        const { sut, generateUuidStub } = makeSut()
        generateUuidStub.result = null
        const email = faker.internet.email()

        const token = await sut.generateEmailToken(email)

        expect(token).toBeNull()
    })

    test('Should throw if GenerateUuid throws', async () => {
        const { sut, generateUuidStub } = makeSut()
        jest.spyOn(generateUuidStub, 'generate').mockImplementationOnce(() => {
            throw new Error()
        })
        const email = faker.internet.email()

        const promise = sut.generateEmailToken(email)

        await expect(promise).rejects.toThrow()
    })

    test('Should return token on success', async () => {
        const { sut, generateEmailTokenRepositoryStub } = makeSut()
        const email = faker.internet.email()

        const token = await sut.generateEmailToken(email)

        expect(token).toBe(generateEmailTokenRepositoryStub.result)
    })

    test('Should throw if GenerateEmailTokenRepository throws', async () => {
        const { sut, generateEmailTokenRepositoryStub } = makeSut()
        jest.spyOn(generateEmailTokenRepositoryStub, 'generate').mockImplementationOnce(() => {
            throw new Error()
        })
        const email = faker.internet.email()

        const promise = sut.generateEmailToken(email)

        await expect(promise).rejects.toThrow()
    })

    test('Should return null if GenerateEmailTokenRepository return null', async () => {
        const { sut, generateEmailTokenRepositoryStub } = makeSut()
        generateEmailTokenRepositoryStub.result = null
        const email = faker.internet.email()

        const token = await sut.generateEmailToken(email)

        expect(token).toBeNull()
    })
})