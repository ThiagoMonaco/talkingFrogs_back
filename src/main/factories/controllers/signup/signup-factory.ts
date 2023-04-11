import { Controller } from '@presentation/protocols'
import { SignupController } from '@presentation/controllers/signup/signup-controller'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { DbAddAccount } from '@data/usecases/account/db-add-account'
import { makeSignUpValidation } from '@main/factories/controllers/signup/signup-validation-factory'
import { makeDbAuthenticationFactory } from '@main/factories/usecases/db-authentication-factory'

export const makeSignUpController = (): Controller => {
    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)

    return new SignupController(dbAddAccount, makeSignUpValidation(), makeDbAuthenticationFactory())
}