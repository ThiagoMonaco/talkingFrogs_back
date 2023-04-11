import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { ControllerStub } from '@tests/presentation/stubs/protocols/controller-stub'
import { LogErrorRepositoryStub } from '@tests/data/stubs/log-error-repository-stub'
import { serverError } from '@presentation/helpers/http-helper'

interface SutTypes {
    sut: LogErrorControllerDecorator,
    controllerStub: ControllerStub,
    logErrorRepositoryStub: LogErrorRepositoryStub
}

const makeSut = (): SutTypes => {
    const controllerStub = new ControllerStub()
    const logErrorRepositoryStub = new LogErrorRepositoryStub()
    const sut = new LogErrorControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
    }
}


describe('LogController decorator', () => {
    test('Should call controller handle correctly', async () => {
        const { sut } = makeSut()
        const spy = jest.spyOn(sut, 'handle')
        const request = {
            body: {
                name: 'test'
            }
        }

        await sut.handle(request)

        expect(spy).toHaveBeenCalledWith(request)
    })

    test('Should return the same response', async () => {
        const { sut, controllerStub} = makeSut()
        const request = {
            body: {
                name: 'test',
                email: 'test@mail.com'
            },
            statusCode: 200
        }
        controllerStub.response = request
        const response = await sut.handle(request)
        expect(response).toEqual(request)
    })

    test('Should call LogErrorRepository if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

        const error = new Error()
        error.stack = 'stack'
        const mockServerError = serverError(error)

        const spy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(mockServerError))

        const httpRequest = {
            body: {
                name: 'test',
                email: 'test@mail.com'
            }
        }

        await sut.handle(httpRequest)

        expect(spy).toHaveBeenCalledWith('stack')
    })
})