import { Controller } from '@presentation/protocols'
import { LogErrorControllerDecorator } from '@main/decorators/log-error-controller-decorator'
import { AskQuestionController } from '@presentation/controllers/ask-question-controller'
import { DbAskQuestion } from '@data/usecases/db-ask-question'
import { LogErrorMongoRepository } from '@infra/db/mongodb/log-error-repository'
import { makeAskQuestionValidation } from '@main/factories/controllers/ask-question/ask-question-validation-factory'
import { QuestionMongoRepository } from '@infra/db/mongodb/question-mongo-repository'

export const makeAskQuestionController = (): Controller => {
    const validator = makeAskQuestionValidation()

    const questionMongoRepository = new QuestionMongoRepository()
    const askQuestion = new DbAskQuestion(questionMongoRepository)

    const askQuestionController = new AskQuestionController(validator, askQuestion)
    const logMongoRepository = new LogErrorMongoRepository()

    return new LogErrorControllerDecorator(askQuestionController, logMongoRepository)
}