import { DbAddAccount } from '@data/usecases/account/db-add-account'
import { HasherStub } from '@tests/data/stubs/criptography-stub'
import { AddAccountRepositoryStub } from '@tests/data/stubs/add-account-repository-stub'
import { CheckAccountByEmailRepositoryStub } from '@tests/data/stubs/check-account-by-email-repository-stub'
import { mockAddAccountRepositoryParams } from '@tests/data/mocks/add-account-repository-mock'

type SutTypes = {
    sut: DbAddAccount,
    hasherStub: HasherStub,

    addAccountRepositoryStub: AddAccountRepositoryStub,

    checkAccountByEmailRepositoryStub: CheckAccountByEmailRepositoryStub
}

const makeSut = (): SutTypes => {
    const hasherStub = new HasherStub()
    const addAccountRepositoryStub = new AddAccountRepositoryStub()
    const checkAccountByEmailRepositoryStub = new CheckAccountByEmailRepositoryStub()
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub)

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
        checkAccountByEmailRepositoryStub
    }
}

describe('DbAddAccount Usecase', () => {
    test('should call Hasher with correct password', async () => {
        const { hasherStub, sut } = makeSut()
        const encryptSpy = jest.spyOn(hasherStub, 'hash')
        const account = mockAddAccountRepositoryParams()

        await sut.add(account)

        expect(encryptSpy).toHaveBeenCalledWith(account.password)
    })

    test('should throw error if hash throws error', async () => {
        const { hasherStub, sut } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
        const account = mockAddAccountRepositoryParams()

        const promise = sut.add(account)

        await expect(promise).rejects.toThrow()
    })

    test('Should call addAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub, hasherStub } = makeSut()
        const spy = jest.spyOn(addAccountRepositoryStub, 'add')
        const account = mockAddAccountRepositoryParams()

        await sut.add(account)

        expect(spy).toHaveBeenCalledWith({
            name: account.name,
            password: hasherStub.hashedValue,
            email: account.email
        })
    })

    test('should throw if addAccountRepository throws an error', async() => {
        const { sut, addAccountRepositoryStub } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
        const account = mockAddAccountRepositoryParams()

        const promise = sut.add(account)

        await expect(promise).rejects.toThrow()
    })

    test('should return true if addAccount runs correctly', async () => {
        const { sut, addAccountRepositoryStub } = makeSut()
        const account = mockAddAccountRepositoryParams()

        const response = await sut.add(account)

        expect(response).toBeTruthy()
    })

    test('Should return false if CheckAccountByEmailRepository returns true',async () => {
        const { sut, checkAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail').mockReturnValueOnce(Promise.resolve(true))
        const account = mockAddAccountRepositoryParams()

        const result = await sut.add(account)
        expect(result).toBeFalsy()
    })

    test('Should call LoadAccountByEmailRepository with correct email',async () => {
        const { sut, checkAccountByEmailRepositoryStub } = makeSut()
        const spy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
        const account = mockAddAccountRepositoryParams()

        await sut.add(account)

        expect(spy).toHaveBeenCalledWith(account.email)
    })
})