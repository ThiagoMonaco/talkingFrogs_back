import { Controller, HttpResponse } from '@presentation/protocols'

export class ControllerStub implements Controller {
    response = {
        statusCode: 200,
        body: {}
    }
    async handle(request: any): Promise<HttpResponse> {
        return this.response
    }
}