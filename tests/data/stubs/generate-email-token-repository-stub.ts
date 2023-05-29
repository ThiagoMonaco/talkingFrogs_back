import { GenerateEmailTokenRepository } from '@data/protocols/db/account/generate-email-token-repository'
import { faker } from '@faker-js/faker'

export class GenerateEmailTokenRepositoryStub implements GenerateEmailTokenRepository {
    result = faker.datatype.uuid()
    async generate(data: GenerateEmailTokenRepository.Params): Promise<GenerateEmailTokenRepository.Result> {
        return this.result
    }
}