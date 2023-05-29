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
            if (accessToken) {
                const account = await this.loadAccountByToken.loadByToken(accessToken)
                if(account) {
                    return ok({ accountId: account.id, accountEmail: account.email })
                }
            }
            return forbidden(new AccessDeniedError())
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