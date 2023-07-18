import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeSignUpController } from '@main/factories/controllers/signup/signup-factory'
import { makeLoginController } from '@main/factories/controllers/login/login-factory'
import { makeValidateEmailToken } from '@main/factories/controllers/validate-email-token/validate-email-token-factory'
import { adaptMiddleware } from '@main/adapters/express-middleware-adapter'
import {
    makeAuthMiddleware,
    makeAuthMiddlewarePassWithoutEmailVerified
} from '@main/factories/middlewares/auth-middleware-factory'
import { makeSendEmailTokenController } from '@main/factories/controllers/send-email-token/send-email-token-factory'
import { makeGetUserDataController } from '@main/factories/controllers/get-user-data/get-user-data-factory'
import {
    makeGetUserDataByTokenController
} from '@main/factories/controllers/get-user-data-by-token/get-user-data-by-token-factory'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
    router.post('/send-email-token', adaptRoute(makeSendEmailTokenController()))
    router.post('/validate-email', adaptMiddleware(makeAuthMiddlewarePassWithoutEmailVerified()) ,adaptRoute(makeValidateEmailToken()))
    router.get('/user/:username', adaptRoute(makeGetUserDataController()))
    router.get('/user-token', adaptMiddleware(makeAuthMiddlewarePassWithoutEmailVerified()), adaptRoute(makeGetUserDataByTokenController()))
}