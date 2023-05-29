import { GenerateEmailTokenRepository } from '@data/protocols/db/account/generate-email-token-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'

export class EmailValidationRepository implements GenerateEmailTokenRepository {
    async generate(data: GenerateEmailTokenRepository.Params): Promise<GenerateEmailTokenRepository.Result> {
        const emailValidationTokens = MongoHelper.getCollection('emailValidationToken')
        const token = data.uuid.slice(0, 5)

        await emailValidationTokens.insertOne({
            email: data.email,
            token: token
        })

        return token
    }

}