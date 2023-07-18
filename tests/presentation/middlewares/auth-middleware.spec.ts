import { AuthMiddleware } from '@presentation/middlewares/auth-middleware'
import { LoadAccountByTokenStub } from '@tests/domain/stubs/load-account-by-token-stub'
import { forbidden, ok } from '@presentation/helpers/http-helper'
import { AccessDeniedError } from '@presentation/errors'
import { faker } from '@faker-js/faker'

interface SutTypes {
    sut: AuthMiddleware
    loadAccountByTokenStub: LoadAccountByTokenStub
}

const makeSut = (passWithoutEmailVerified = false): SutTypes => {
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub, passWithoutEmailVerified)
    return {
        sut,
        loadAccountByTokenStub
    }
}

describe('Auth Middleware', () => {
    test('Should return 403 if no access token is provided', async () => {
        const { sut } = makeSut()
        const httpResponse = await sut.handle({ accessToken: undefined })

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should call LoadAccountByToken with correct accessToken', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
        const accessToken = faker.datatype.uuid()

        await sut.handle({ accessToken })

        expect(loadSpy).toHaveBeenCalledWith(accessToken)
    })

    test('Should return 403 if LoadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        loadAccountByTokenStub.result = null

        const httpResponse = await sut.handle({ accessToken: faker.datatype.uuid() })

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should return 403 if account is not with email verified', async () => {
        const { sut, loadAccountByTokenStub } = makeSut()
        loadAccountByTokenStub.result.isEmailVerified = false

        const httpResponse = await sut.handle({ accessToken: faker.datatype.uuid() })

        expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
    })

    test('Should return 200 if passWithoutEmailVerified is true and account is not with email verified', async () => {
        const { sut, loadAccountByTokenStub } = makeSut(true)
        loadAccountByTokenStub.result.isEmailVerified = false

        const httpResponse = await sut.handle({ accessToken: faker.datatype.uuid() })

        expect(httpResponse).toEqual(ok({
            accountId: loadAccountByTokenStub.result.id,
            accountEmail: loadAccountByTokenStub.result.email,
            accountName: loadAccountByTokenStub.result.name,
            isEmailVerified: loadAccountByTokenStub.result.isEmailVerified
        }))
    })

    test('Should return 200 if LoadAccountByToken returns an valid account', async () => {
        const { sut , loadAccountByTokenStub } = makeSut()
        const httpResponse = await sut.handle({ accessToken: faker.datatype.uuid() })

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            accountId: loadAccountByTokenStub.result.id,
            accountEmail: loadAccountByTokenStub.result.email,
            accountName: loadAccountByTokenStub.result.name,
            isEmailVerified: loadAccountByTokenStub.result.isEmailVerified
        })
    })
})