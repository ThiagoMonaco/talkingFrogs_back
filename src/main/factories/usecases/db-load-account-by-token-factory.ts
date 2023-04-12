import { DbLoadAccountByToken } from '@data/usecases/db-load-account-by-token'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter'
import env from '@main/config/env'


export const makeDbLoadAccountByToken = (): DbLoadAccountByToken => {
    const accountMongoRepository = new AccountMongoRepository()
    const jwtAdapter = new JwtAdapter(env.jwtSecret)
    return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
