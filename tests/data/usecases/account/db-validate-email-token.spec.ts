import { DbValidateEmailToken } from '@data/usecases/db-validate-email-token'
import { ValidateEmailTokenRepositoryStub } from '@tests/data/stubs/validate-email-token-repository-stub'
import { ValidateEmailToken } from '@domain/usecases/validate-email-token'
import { faker } from '@faker-js/faker'

interface SutTypes {
    sut: DbValidateEmailToken
    validateEmailTokenRepositoryStub: ValidateEmailTokenRepositoryStub
}

const makeSut = (): SutTypes => {
    const validateEmailTokenRepositoryStub = new ValidateEmailTokenRepositoryStub()
    const sut = new DbValidateEmailToken(validateEmailTokenRepositoryStub)
    return {
        sut,
        validateEmailTokenRepositoryStub
    }
}

const mockParams = (): ValidateEmailToken.Params => ({
    token: faker.datatype.uuid(),
    accountEmail: faker.internet.email()
})

describe('DbValidateEmailToken', () => {
    test('should call ValidateEmailTokenRepository with correct values', async () => {
        const { sut, validateEmailTokenRepositoryStub } = makeSut()
        const validateEmailTokenSpy = jest.spyOn(validateEmailTokenRepositoryStub, 'validateEmailToken')
        const params = mockParams()

        await sut.validateEmailToken(params)

        expect(validateEmailTokenSpy).toHaveBeenCalledWith(params)
    })

    test('should throw if ValidateEmailTokenRepository throws', async () => {
        const { sut, validateEmailTokenRepositoryStub } = makeSut()
        jest.spyOn(validateEmailTokenRepositoryStub, 'validateEmailToken').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.validateEmailToken(mockParams())

        await expect(promise).rejects.toThrow()
    })

    test('should return false if ValidateEmailTokenRepository returns false', async () => {
        const { sut, validateEmailTokenRepositoryStub } = makeSut()
        validateEmailTokenRepositoryStub.result = false

        const result = await sut.validateEmailToken(mockParams())

        expect(result).toBeFalsy()
    })

    test('should return true if ValidateEmailTokenRepository returns true', async () => {
        const { sut } = makeSut()

        const result = await sut.validateEmailToken(mockParams())

        expect(result).toBeTruthy()
    })
})