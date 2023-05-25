import { AddAccount } from '@domain/usecases/add-account'
import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { Hasher } from '@data/protocols/criptography/hasher'
import { CheckAccountByEmailRepository } from '@data/protocols/db/account/check-account-by-email-repository'
import { CheckAccountByNameRepository } from '@data/protocols/db/account/check-account-by-name-repository'
import { EmailAlreadyExistsError, NameAlreadyExistsError } from '@presentation/errors'

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
        private readonly checkAccountByNameRepository: CheckAccountByNameRepository
    ) {}
    async add(account: AddAccount.Params): Promise<AddAccount.Result> {
        const existedAccountEmail = await this.checkAccountByEmailRepository.checkByEmail(account.email)
        const existedAccountName = await this.checkAccountByNameRepository.checkByName(account.name)
        if(!existedAccountEmail && !existedAccountName) {
            const hashedPassword = await this.hasher.hash(account.password)
            const result = await this.addAccountRepository.add({...account, password: hashedPassword})
            return !!result
        }
        if(existedAccountEmail) {
            throw new EmailAlreadyExistsError()
        }

        if(existedAccountName) {
            throw new NameAlreadyExistsError()
        }

        return false
    }

}