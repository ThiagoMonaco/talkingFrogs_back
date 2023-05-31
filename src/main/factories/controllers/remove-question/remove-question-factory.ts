import { Controller } from '@presentation/protocols'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import {
    makeRemoveQuestionControllerValidation
} from '@main/factories/controllers/remove-question/remove-question-validation-factory'
import { DbRemoveQuestion } from '@data/usecases/db-remove-question'
import { RemoveQuestionController } from '@presentation/controllers/remove-question-controller'
import { QuestionMongoRepository } from '@infra/db/mongodb/question-mongo-repository'

export const makeRemoveQuestionController = (): Controller => {
    const validation = makeRemoveQuestionControllerValidation()

    const questionMongoRepository = new QuestionMongoRepository()
    const removeQuestion = new DbRemoveQuestion(questionMongoRepository)

    const removeQuestionController = new RemoveQuestionController(validation, removeQuestion)

    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(removeQuestionController, logMongoRepository)
}