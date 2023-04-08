import { AddAccount } from '@domain/usecases/add-account'

export class AddAccountStub implements AddAccount {
    account: AddAccount.Params
    result = true
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
        this.account = account
        return this.result
    }
}