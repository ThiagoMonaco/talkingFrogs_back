import { Controller } from '@presentation/protocols'
import { SendEmailTokenController } from '@presentation/controllers/send-email-token-controller'
import {
	makeSendEmailTokenValidation
} from '@main/factories/controllers/send-email-token/send-email-token-validation-factory'
import { EmailValidationRepository } from '@infra/db/mongodb/email-validation-repository'
import { UuidAdapter } from '@infra/data-types/uuid-adapter'
import { DbGenerateEmailToken } from '@data/usecases/db-generate-email-token'
import { NodeMailerAdapter } from '@infra/email-sender/node-mailer/node-mailer-adapter'
import { SendEmailUsecase } from '@data/usecases/send-email-usecase'
import { DbCheckEmailExists } from '@data/usecases/db-check-email-exists'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'

export const makeSendEmailTokenController = (): Controller => {

	const nodeMailerAdapter = new NodeMailerAdapter()
	const sendEmail = new SendEmailUsecase(nodeMailerAdapter)

	const generateEmailTokenRepository = new EmailValidationRepository()

	const uuidGenerator = new UuidAdapter()
	const generateEmailToken = new DbGenerateEmailToken(generateEmailTokenRepository, uuidGenerator)

	const accountMongoRepository = new AccountMongoRepository()
	const checkEmailExists = new DbCheckEmailExists(accountMongoRepository)

	const validation = makeSendEmailTokenValidation()
	const controller = new SendEmailTokenController(
		validation,
		sendEmail,
		generateEmailToken,
		checkEmailExists
	)

	const logMongoRepository = new LogErrorMongoRepository()

	return new LogErrorControllerDecorator(controller, logMongoRepository)
}