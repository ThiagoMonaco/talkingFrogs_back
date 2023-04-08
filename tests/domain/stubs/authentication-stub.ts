import { Authentication } from '@domain/usecases/authentication'
import { faker } from '@faker-js/faker'

export class AuthenticationStub implements Authentication {
    params: Authentication.Params
    result: Authentication.Result = {
        name: faker.name.fullName(),
        accessToken: faker.datatype.uuid()
    }
    async auth(authentication: Authentication.Params): Promise<Authentication.Result> {
        this.params = authentication
        return this.result
    }

}