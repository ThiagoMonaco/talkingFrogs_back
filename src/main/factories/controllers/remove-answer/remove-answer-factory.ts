import { Controller } from '@presentation/protocols'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { DbAnswerQuestion } from '@data/usecases/db-answer-question'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { makeRemoveAnswerValidation } from '@main/factories/controllers/remove-answer/remove-answer-validation-factory'
import { RemoveAnswerController } from '@presentation/controllers/remove-answer-controller'

export const makeRemoveAnswerController = (): Controller => {
    const validation = makeRemoveAnswerValidation()

    const accountMongoRepository = new AccountMongoRepository()
    const answerQuestion = new DbAnswerQuestion(accountMongoRepository)

    const removeAnswerController = new RemoveAnswerController(validation, answerQuestion)

    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(removeAnswerController, logMongoRepository)
}