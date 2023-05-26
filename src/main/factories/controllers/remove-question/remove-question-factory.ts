import { Controller } from '@presentation/protocols'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import {
    makeRemoveQuestionControllerValidation
} from '@main/factories/controllers/remove-question/remove-question-validation-factory'
import { DbRemoveQuestion } from '@data/usecases/db-remove-question'
import { RemoveQuestionController } from '@presentation/controllers/remove-question-controller'

export const makeRemoveQuestionController = (): Controller => {
    const validation = makeRemoveQuestionControllerValidation()

    const accountMongoRepository = new AccountMongoRepository()
    const removeQuestion = new DbRemoveQuestion(accountMongoRepository)

    const removeQuestionController = new RemoveQuestionController(validation, removeQuestion)

    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(removeQuestionController, logMongoRepository)
}