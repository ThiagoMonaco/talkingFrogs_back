import { AddAccount } from '@domain/usecases/add-account'
import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { Hasher } from '@data/protocols/criptography/hasher'
import { CheckAccountByEmailRepository } from '@data/protocols/db/account/check-account-by-email-repository'

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
    ) {}
    async add(account: AddAccount.Params): Promise<AddAccount.Result> {
        const existedAccount = await this.checkAccountByEmailRepository.checkByEmail(account.email)
        if(!existedAccount) {
            const hashedPassword = await this.hasher.hash(account.password)
            const newAccount = await this.addAccountRepository.add({...account, password: hashedPassword})
            return newAccount.name
        }
        return null
    }

}