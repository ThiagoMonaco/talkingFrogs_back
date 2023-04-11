import jwt from 'jsonwebtoken'
import { Encrypter } from '@data/protocols/criptography/encrypter'
import { Decrypter } from '@data/protocols/criptography/decrypter'
export class JwtAdapter implements Encrypter, Decrypter {
    private readonly secret: string

    constructor(secret: string) {
        this.secret = secret
    }

    async encrypt(value: string): Promise<string> {
        const token = await jwt.sign({ id: value }, this.secret)
        return token
    }

    async decrypt(value: string): Promise<string> {
        return await jwt.verify(value, this.secret)
    }
}