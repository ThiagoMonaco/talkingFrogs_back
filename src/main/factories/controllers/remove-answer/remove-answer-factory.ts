import { Controller } from '@presentation/protocols'
import { DbAnswerQuestion } from '@data/usecases/db-answer-question'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { makeRemoveAnswerValidation } from '@main/factories/controllers/remove-answer/remove-answer-validation-factory'
import { RemoveAnswerController } from '@presentation/controllers/remove-answer-controller'
import { QuestionMongoRepository } from '@infra/db/mongodb/question-mongo-repository'

export const makeRemoveAnswerController = (): Controller => {
    const validation = makeRemoveAnswerValidation()

    const questionMongoRepository = new QuestionMongoRepository()
    const answerQuestion = new DbAnswerQuestion(questionMongoRepository)

    const removeAnswerController = new RemoveAnswerController(validation, answerQuestion)

    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(removeAnswerController, logMongoRepository)
}