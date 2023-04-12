import { AccountModel } from '@domain/models/account'

export interface LoadAccountByToken {
    loadByToken(accessToken: string): Promise<AccountModel>
}