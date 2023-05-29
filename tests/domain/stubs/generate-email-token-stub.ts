import { GenerateEmailToken } from '@domain/usecases/generate-email-token'
import { faker } from '@faker-js/faker'

export class GenerateEmailTokenStub implements GenerateEmailToken {
    result = faker.datatype.uuid()
    async generateEmailToken(): Promise<string> {
        return this.result
    }
}