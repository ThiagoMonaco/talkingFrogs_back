import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { CheckAccountByEmailRepository } from '@data/protocols/db/account/check-account-by-email-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/account/update-access-token-repository'

export class AccountMongoRepository implements
    AddAccountRepository,
    CheckAccountByEmailRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository {

    async findById(id) {
        const accountCollection = MongoHelper.getCollection('accounts')
        return await accountCollection.findOne({ _id: id })
    }
    async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const accountId = result.insertedId
        const account = await this.findById(accountId)

        return account && account.name
    }

    async checkByEmail(email: CheckAccountByEmailRepository.Params): Promise<CheckAccountByEmailRepository.Result> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        return !!account
    }

    async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        if(!account) {
            return null
        }
        return MongoHelper.mapId(account)
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const parsedId = MongoHelper.parseToObjectId(id)
        await accountCollection.updateOne({
            _id: parsedId
        }, {
            $set: {
                accessToken: token
            }
        })
    }

}