import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { Decrypter } from '@data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '@domain/models/account'

export class DbLoadAccountByToken implements LoadAccountByToken{
    private readonly decrypter: Decrypter
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository

    constructor(decrypter: Decrypter, loadAccountByTokenRepository: LoadAccountByTokenRepository) {
        this.decrypter = decrypter
        this.loadAccountByTokenRepository = loadAccountByTokenRepository
    }

    async loadByToken(accessToken: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken)
        if(!token) {
            return null
        }
        return await this.loadAccountByTokenRepository.loadByToken(accessToken)
    }


}