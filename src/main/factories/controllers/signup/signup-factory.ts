import { Controller } from '@presentation/protocols'
import { SignupController } from '@presentation/controllers/signup-controller'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { DbAddAccount } from '@data/usecases/db-add-account'
import { makeSignUpValidation } from '@main/factories/controllers/signup/signup-validation-factory'
import { makeDbAuthenticationFactory } from '@main/factories/usecases/db-authentication-factory'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { SendEmailUsecase } from '@data/usecases/send-email-usecase'
import { NodeMailerAdapter } from '@infra/email-sender/node-mailer/node-mailer-adapter'
import { DbGenerateEmailToken } from '@data/usecases/db-generate-email-token'
import { EmailValidationRepository } from '@infra/db/mongodb/email-validation-repository'
import { UuidAdapter } from '@infra/data-types/uuid-adapter'

export const makeSignUpController = (): Controller => {
    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)
    const accountMongoRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(
        bcryptAdapter,
        accountMongoRepository,
        accountMongoRepository,
        accountMongoRepository
    )

    const nodeMailerAdapter = new NodeMailerAdapter()
    const sendEmail = new SendEmailUsecase(nodeMailerAdapter)

    const generateEmailTokenRepository = new EmailValidationRepository()

    const uuidGenerator = new UuidAdapter()
    const generateEmailToken = new DbGenerateEmailToken(generateEmailTokenRepository, uuidGenerator)

    const logMongoRepository = new LogErrorMongoRepository()
    const signupController = new SignupController(
        dbAddAccount,
        makeSignUpValidation(),
        makeDbAuthenticationFactory(),
        sendEmail,
        generateEmailToken
    )

    return new LogErrorControllerDecorator(signupController, logMongoRepository)
}