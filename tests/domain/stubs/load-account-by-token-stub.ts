import { LoadAccountByToken } from '@domain/usecases/load-account-by-token'
import { AccountModel } from '@domain/models/account'
import { mockAccountModelWithAccessToken } from '@tests/domain/mocks/account-model-mock'

export class LoadAccountByTokenStub implements LoadAccountByToken {
    result = mockAccountModelWithAccessToken()
    async loadByToken(accessToken: string): Promise<AccountModel> {
        return this.result
    }

}