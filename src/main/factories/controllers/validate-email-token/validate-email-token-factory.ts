import { Controller } from '@presentation/protocols'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { ValidateEmailTokenController } from '@presentation/controllers/validate-email-token-controller'
import { DbValidateEmailToken } from '@data/usecases/db-validate-email-token'
import { EmailValidationRepository } from '@infra/db/mongodb/email-validation-repository'
import { DbSetAccountEmailValidated } from '@data/usecases/db-set-account-email-validated'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import {
    makeValidateEmailTokenValidation
} from '@main/factories/controllers/validate-email-token/validate-email-token-validation-factory'

export const makeValidateEmailToken = (): Controller => {
    const validation = makeValidateEmailTokenValidation()

    const emailValidationRepository = new EmailValidationRepository()
    const accountMongoRepository = new AccountMongoRepository()

    const validateEmailToken = new DbValidateEmailToken(emailValidationRepository)
    const setEmailAccountValidated = new DbSetAccountEmailValidated(accountMongoRepository)

    const validateEmailTokenController = new ValidateEmailTokenController(validation, validateEmailToken, setEmailAccountValidated)

    const logMongoRepository = new LogErrorMongoRepository()
    return new LogErrorControllerDecorator(validateEmailTokenController, logMongoRepository)
}