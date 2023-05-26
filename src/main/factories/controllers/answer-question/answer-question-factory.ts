import { Controller } from '@presentation/protocols'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { AnswerQuestionController } from '@presentation/controllers/answer-question-controller'
import {
    makeAnswerQuestionValidation
} from '@main/factories/controllers/answer-question/answer-question-validation-factory'
import { DbAnswerQuestion } from '@data/usecases/db-answer-question'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'

export const makeAnswerQuestionController = (): Controller => {
    const validation = makeAnswerQuestionValidation()

    const accountMongoRepository = new AccountMongoRepository()
    const answerQuestion = new DbAnswerQuestion(accountMongoRepository)

    const answerQuestionController = new AnswerQuestionController(validation, answerQuestion)

    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(answerQuestionController, logMongoRepository)
}