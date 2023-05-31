import { Router } from 'express'
import { adaptRoute } from '@main/adapters/express-route-adapter'
import { makeSignUpController } from '@main/factories/controllers/signup/signup-factory'
import { makeLoginController } from '@main/factories/controllers/login/login-factory'
import { makeValidateEmailToken } from '@main/factories/controllers/validate-email-token/validate-email-token-factory'
import { adaptMiddleware } from '@main/adapters/express-middleware-adapter'
import {
    makeAuthMiddlewarePassWithoutEmailVerified
} from '@main/factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
    router.post('/validate-email', adaptMiddleware(makeAuthMiddlewarePassWithoutEmailVerified()) ,adaptRoute(makeValidateEmailToken()))
}