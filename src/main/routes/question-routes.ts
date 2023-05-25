import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeAskQuestionController } from '@main/factories/controllers/ask-question/ask-question-factory'

export default (router: Router): void => {
    router.post('/question/ask', adaptRoute(makeAskQuestionController()))
}