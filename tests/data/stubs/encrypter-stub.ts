import { Encrypter } from '@data/protocols/criptography/encrypter'
import { faker } from '@faker-js/faker'

export class EncrypterStub implements Encrypter {
    result = faker.datatype.uuid()
    async encrypt(value: string): Promise<string> {
        return this.result
    }
}