import { Controller } from '@presentation/protocols'
import { SignupController } from '@presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { DbAddAccount } from '@data/usecases/db-add-account'
import { makeSignUpValidation } from '@main/factories/controllers/signup/signup-validation-factory'
import { makeDbAuthenticationFactory } from '@main/factories/usecases/db-authentication-factory'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'

export const makeSignUpController = (): Controller => {
    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)

    const logMongoRepository = new LogErrorMongoRepository()
    const signupController = new SignupController(dbAddAccount, makeSignUpValidation(), makeDbAuthenticationFactory())

    return new LogErrorControllerDecorator(signupController, logMongoRepository)
}