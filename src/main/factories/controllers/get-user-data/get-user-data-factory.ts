import { Controller } from '@presentation/protocols'
import { GetUserDataController } from '@presentation/controllers/get-user-data-controller'
import { makeGetUserDataValidation } from '@main/factories/controllers/get-user-data/get-user-data-validation-factory'
import { DbGetUserDataByName } from '@data/usecases/db-get-user-data-by-name'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'

export const makeGetUserDataController = (): Controller => {

	const accountMongoRepository = new AccountMongoRepository()

	const dbGetUserDataByName = new DbGetUserDataByName(accountMongoRepository)

	const validation = makeGetUserDataValidation()
	const getUserDataController = new GetUserDataController(validation, dbGetUserDataByName)
	const logMongoRepository = new LogErrorMongoRepository()

	return new LogErrorControllerDecorator(getUserDataController, logMongoRepository)
}