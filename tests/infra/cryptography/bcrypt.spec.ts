import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import bcrypt from 'bcrypt'

interface SutTypes {
    sut: BcryptAdapter
}

const salt = 12
const makeSut = (): SutTypes => {
    const sut = new BcryptAdapter(salt)

    return {
        sut
    }
}

jest.mock('bcrypt',() => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
    },
    async compare(): Promise<boolean> {
        return new Promise((resolve => resolve(true)))
    }
}))

describe('BcryptAdapter', function () {
    test('Should call hash with correct values', async () => {
        const { sut } = makeSut()
        const spy = jest.spyOn(bcrypt, 'hash')

        await sut.hash('password')

        expect(spy).toHaveBeenCalledWith('password', salt)
    })

    test('Should return hashed value', async () => {
        const { sut } = makeSut()

        const response = await sut.hash('password')

        expect(response).toEqual('hashed_password')
    })

    test('should throw a error if encrypt throws a error', async () => {
        const { sut } = makeSut()
        jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })

        const promise = sut.hash('password')

        await expect(promise).rejects.toThrow()
    })

    test('Should call compare with correct values', async () => {
        const { sut } = makeSut()
        const spy = jest.spyOn(bcrypt, 'compare')

        await sut.compare('value', 'hash')

        expect(spy).toHaveBeenCalledWith('value', 'hash')
    })

    test('Should return true when compare succeeds', async () => {
        const { sut } = makeSut()

        const response = await sut.compare('value', 'hash')

        expect(response).toBeTruthy()
    })

    test('should return false when compare fails', async () => {
        const { sut } = makeSut()
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

        const response = await sut.compare('value', 'hash')

        expect(response).toBeFalsy()
    })

    test('should throw a error if encrypt throws a error', async () => {
        const { sut } = makeSut()
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })

        const promise = sut.compare('value', 'hash')

        await expect(promise).rejects.toThrow()
    })

})