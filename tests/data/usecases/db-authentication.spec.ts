import { DbAuthentication } from '@data/usecases/db-authentication'
import { LoadAccountByEmailRepositoryStub } from '@tests/data/stubs/load-account-by-email-repository-stub'
import { HashComparerStub } from '@tests/data/stubs/hash-comparer-stub'
import { EncrypterStub } from '@tests/data/stubs/encrypter-stub'
import { UpdateAccessTokenRepositoryStub } from '@tests/data/stubs/update-access-token-repository-stub'
import { mockAuthenticationParams } from '@tests/data/mocks/authentication-mock'


interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
    hashComparerStub: HashComparerStub
    encrypterStub: EncrypterStub
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryStub
}

const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const hashComparerStub = new HashComparerStub()
    const encrypterStub = new EncrypterStub()
    const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        encrypterStub,
        updateAccessTokenRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {
    test('Should call LoadAccountByEmailRepository with correct email',async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        const spy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
        const payload = mockAuthenticationParams()

        await sut.auth(payload)

        expect(spy).toHaveBeenCalledWith(payload.email)
    })

    test('Should throw an error if loadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
        const payload =mockAuthenticationParams()

        const promise = sut.auth(payload)

        await expect(promise).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository return null',async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut()
        loadAccountByEmailRepositoryStub.result = null
        const payload = mockAuthenticationParams()

        const response = await sut.auth(payload)

        expect(response).toBeNull()
    })

    test('Should call HashComparer with correct values',async () => {
        const { sut, hashComparerStub, loadAccountByEmailRepositoryStub } = makeSut()
        const spy = jest.spyOn(hashComparerStub, 'compare')
        const payload = mockAuthenticationParams()

        await sut.auth(payload)

        expect(spy).toHaveBeenCalledWith(payload.password, loadAccountByEmailRepositoryStub.result.password)
    })

    test('Should throw an error if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject)=>reject(new Error())))
        const payload = mockAuthenticationParams()

        const promise = sut.auth(payload)

        await expect(promise).rejects.toThrow()
    })

    test('Should return null if HashComparer return false',async () => {
        const { sut, hashComparerStub } = makeSut()
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
        const payload = mockAuthenticationParams()

        const response = await sut.auth(payload)

        expect(response).toBeNull()
    })

    test('Should call TokenGenerator with correct id',async () => {
        const { sut, encrypterStub, loadAccountByEmailRepositoryStub } = makeSut()
        const spy = jest.spyOn(encrypterStub, 'encrypt')
        const payload = mockAuthenticationParams()

        await sut.auth(payload)

        expect(spy).toHaveBeenCalledWith(loadAccountByEmailRepositoryStub.result.id)
    })

    test('Should throw an error if TokenGenerator throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject)=>reject(new Error())))
        const payload = mockAuthenticationParams()

        const promise = sut.auth(payload)

        await expect(promise).rejects.toThrow()
    })

    test('Should call token and return the correct id', async () => {
        const { sut, encrypterStub, loadAccountByEmailRepositoryStub } = makeSut()

        const result = await sut.auth(mockAuthenticationParams())

        expect(result.accessToken).toBe(encrypterStub.result)
        expect(result.name).toBe(loadAccountByEmailRepositoryStub.result.name)
    })

    test('Should call UpdateAccessTokenRepository with correct id',async () => {
        const { sut, updateAccessTokenRepositoryStub, loadAccountByEmailRepositoryStub, encrypterStub } = makeSut()
        const spy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        const payload = mockAuthenticationParams()

        await sut.auth(payload)

        expect(spy).toHaveBeenCalledWith(loadAccountByEmailRepositoryStub.result.id, encrypterStub.result)
    })

    test('Should throw an error if updateAccessTokenRepositoryStub throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut()
        jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject)=>reject(new Error())))
        const payload = mockAuthenticationParams()

        const promise = sut.auth(payload)

        await expect(promise).rejects.toThrow()
    })

})