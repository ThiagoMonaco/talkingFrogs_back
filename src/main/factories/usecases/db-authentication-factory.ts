import { DbAuthentication } from '@data/usecases/db-authentication'
import { BcryptAdapter } from '@infra/cryptography/bcrypt-adapter'
import env from '@main/config/env'
import { AccountMongoRepository } from '@infra/db/mongodb/account-mongo-repository'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter'

export const makeDbAuthenticationFactory = (): DbAuthentication => {
    const salt = 12

    const bcryptAdapter = new BcryptAdapter(salt)
    const jwtAdapter = new JwtAdapter(env.jwtSecret, env.jwtExpiresIn)
    const accountMongoRepository = new AccountMongoRepository()

    const dbAuthentication = new DbAuthentication(
        accountMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        accountMongoRepository
    )

    return dbAuthentication
}