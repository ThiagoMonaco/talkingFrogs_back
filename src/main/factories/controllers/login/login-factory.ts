import { Controller } from '@presentation/protocols'
import { makeDbAuthenticationFactory } from '@main/factories/usecases/db-authentication-factory'
import { LoginController } from '@presentation/controllers/login-controller'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { makeLoginValidation } from '@main/factories/controllers/login/login-validation-factory'

export const makeLoginController = (): Controller => {
    const dbAuthentication = makeDbAuthenticationFactory()
    const validation = makeLoginValidation()

    const loginController =  new LoginController(validation, dbAuthentication)
    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(loginController, logMongoRepository)
}