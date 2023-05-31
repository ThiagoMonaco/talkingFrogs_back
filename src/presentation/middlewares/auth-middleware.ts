import { HttpResponse, Middleware } from '@presentation/protocols'
import { forbidden, ok, serverError } from '@presentation/helpers/http-helper'
import { AccessDeniedError } from '@presentation/errors'
import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'


export class AuthMiddleware implements Middleware {
    private readonly loadAccountByToken: LoadAccountByToken

    constructor(loadAccountByToken: LoadAccountByToken) {
        this.loadAccountByToken = loadAccountByToken
    }

    async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
        try {
            const { accessToken } = request

            if(!accessToken) {
                return forbidden(new AccessDeniedError())
            }

            const account = await this.loadAccountByToken.loadByToken(accessToken)
            if(!account) {
                return forbidden(new AccessDeniedError())
            }

            if(!account.isEmailVerified) {
                return forbidden(new AccessDeniedError())
            }

            return ok({ accountId: account.id, accountEmail: account.email })
        } catch (e) {
            return serverError(e)
        }
    }
}

export namespace AuthMiddleware {
    export type Request = {
        accessToken?: string
    }
}