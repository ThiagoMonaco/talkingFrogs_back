import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter'
interface SutTypes {
    sut: JwtAdapter
}

const makeSut = (): SutTypes => {
    const sut = new JwtAdapter('secret', '1d')

    return {
        sut
    }
}

jest.mock('jsonwebtoken', () => ({
    async sign (): Promise<string> {
        return new Promise(resolve => resolve('token'))
    },

    async verify (): Promise<string> {
        return new Promise(resolve => resolve('id'))
    }
}))

describe('Jwt adapter', () => {
    test('should call sign with correct values', async () => {
        const { sut } = makeSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('value')
        expect(signSpy).toHaveBeenCalledWith({ id: 'value' }, 'secret', { expiresIn: '1d' })
    })

    test('Should return a token on sign success', async () => {
        const { sut } = makeSut()
        const token = await sut.encrypt('value')
        expect(token).toBe('token')
    })

    test('Should throw if hash throws', async () => {
        const { sut } = makeSut()
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.encrypt('value')
        await expect(promise).rejects.toThrow()
    })

    test('Should call verify with correct values', async () => {
        const { sut } = makeSut()
        const spy = jest.spyOn(jwt, 'verify')
        await sut.decrypt('token')
        expect(spy).toHaveBeenCalledWith('token', 'secret')
    })

    test('Should return a value on verify success', async () => {
        const { sut } = makeSut()
        const value = await sut.decrypt('token')
        expect(value).toBe('id')
    })

    test('Should throw if verify throws', async () => {
        const { sut } = makeSut()
        jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
            throw new Error()
        })
        const promise = sut.decrypt('token')
        await expect(promise).rejects.toThrow()
    })

})