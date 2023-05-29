import { GenerateUuid } from '@data/protocols/uuid/generate-uuid'
import { faker } from '@faker-js/faker'

export class GenerateUuidStub implements GenerateUuid {
    result = faker.datatype.uuid()
    async generate(): Promise<GenerateUuid.Result> {
        return this.result
    }
}