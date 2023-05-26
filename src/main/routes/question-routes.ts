import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeAskQuestionController } from '@main/factories/controllers/ask-question/ask-question-factory'
import { makeAnswerQuestionController } from '@main/factories/controllers/answer-question/answer-question-factory'
import { adaptMiddleware } from '@main/adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth-middleware-factory'
import { makeRemoveAnswerController } from '@main/factories/controllers/remove-answer/remove-answer-factory'
import { makeRemoveQuestionController } from '@main/factories/controllers/remove-question/remove-question-factory'

export default (router: Router): void => {
    router.post('/question/ask', adaptRoute(makeAskQuestionController()))
    router.post('/question/remove', adaptMiddleware(makeAuthMiddleware()), adaptRoute(makeRemoveQuestionController()))
    router.post('/question/answer', adaptMiddleware(makeAuthMiddleware()) ,adaptRoute(makeAnswerQuestionController()))
    router.post('/question/answer/remove', adaptMiddleware(makeAuthMiddleware()) ,adaptRoute(makeRemoveAnswerController()))
}