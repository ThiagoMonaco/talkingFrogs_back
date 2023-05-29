import { DbSetAccountEmailValidated } from '@data/usecases/db-set-account-email-validated'
import { SetAccountEmailValidatedRepositoryStub } from '@tests/data/stubs/set-account-email-validated-repository-stub'
import { SetAccountEmailValidated } from '@domain/usecases/set-account-email-validated'
import { faker } from '@faker-js/faker'

interface SutTypes {
    sut: DbSetAccountEmailValidated
    setAccountEmailValidatedRepositoryStub: SetAccountEmailValidatedRepositoryStub
}

export const makeSut = (): SutTypes => {
    const setAccountEmailValidatedRepositoryStub = new SetAccountEmailValidatedRepositoryStub()
    const sut = new DbSetAccountEmailValidated(setAccountEmailValidatedRepositoryStub)
    return {
        sut,
        setAccountEmailValidatedRepositoryStub
    }
}

describe('DbSetAccountEmailValidated Usecase', () => {
    test('Should call SetAccountEmailValidatedRepository with correct values', async () => {
        const { sut, setAccountEmailValidatedRepositoryStub } = makeSut()
        const setEmailValidatedSpy = jest.spyOn(setAccountEmailValidatedRepositoryStub, 'setEmailValidated')
        const accountId = faker.datatype.uuid()

        await sut.setEmailValidated(accountId)

        expect(setEmailValidatedSpy).toHaveBeenCalledWith(accountId)
    })

    test('Should throw if SetAccountEmailValidatedRepository throws', async () => {
        const { sut, setAccountEmailValidatedRepositoryStub } = makeSut()
        jest.spyOn(setAccountEmailValidatedRepositoryStub, 'setEmailValidated').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.setEmailValidated(faker.datatype.uuid())

        await expect(promise).rejects.toThrow()
    })

    test('Should return false if SetAccountEmailValidatedRepository returns false', async () => {
        const { sut, setAccountEmailValidatedRepositoryStub } = makeSut()
        setAccountEmailValidatedRepositoryStub.result = false
        const isValid = await sut.setEmailValidated(faker.datatype.uuid())
        expect(isValid).toBeFalsy()
    })

    test('Should return true on success', async () => {
        const { sut } = makeSut()
        const isValid = await sut.setEmailValidated(faker.datatype.uuid())
        expect(isValid).toBeTruthy()
    })
})