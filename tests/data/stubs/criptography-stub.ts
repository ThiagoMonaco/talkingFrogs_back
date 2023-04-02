import { Hasher } from '@data/protocols/criptography/hasher'
import { faker } from '@faker-js/faker'

export class HasherStub implements Hasher {
    value: string
    hashedValue = faker.datatype.uuid()
    async hash (value: string): Promise<string> {
        this.value = value
        return this.hashedValue
    }
}