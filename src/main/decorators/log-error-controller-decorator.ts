import { Controller, HttpResponse } from '@presentation/protocols'
import { LogErrorRepository } from '@data/protocols/db/log/log-error-repository'

export class LogErrorControllerDecorator implements Controller {
    private readonly controller: Controller
    private readonly logErrorRepository: LogErrorRepository

    constructor(controller: Controller, logErrorRepository: LogErrorRepository) {
        this.controller = controller
        this.logErrorRepository = logErrorRepository
    }

    async handle (request: any): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(request)
        if(httpResponse.statusCode === 500) {
            console.log(httpResponse.body.stack)
            await this.logErrorRepository.logError(httpResponse.body.stack)
        }
        return httpResponse
    }
}