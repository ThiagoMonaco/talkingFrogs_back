import { Controller } from '@presentation/protocols'
import { GetUserDataByTokenController } from '@presentation/controllers/get-user-data-by-token-controller'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'

export const makeGetUserDataByTokenController = (): Controller => {
	const controller = new GetUserDataByTokenController()
	const logMongoRepository = new LogErrorMongoRepository()

	return new LogErrorControllerDecorator(controller, logMongoRepository)
}