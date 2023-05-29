import { GenerateEmailTokenRepository } from '@data/protocols/db/account/generate-email-token-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { ValidateEmailTokenRepository } from '@data/protocols/db/account/validate-email-token-repository'

export class EmailValidationRepository implements
    GenerateEmailTokenRepository,
    ValidateEmailTokenRepository {
    async generate(data: GenerateEmailTokenRepository.Params): Promise<GenerateEmailTokenRepository.Result> {
        const emailValidationTokens = MongoHelper.getCollection('emailValidationToken')
        const token = data.uuid.slice(0, 5)

        await emailValidationTokens.insertOne({
            email: data.email,
            token: token
        })

        return token
    }

    async validateEmailToken(params: ValidateEmailTokenRepository.Params): Promise<ValidateEmailTokenRepository.Result> {
        const emailValidationTokens = MongoHelper.getCollection('emailValidationToken')
        const result = await emailValidationTokens.deleteOne({
            email: params.accountEmail,
            token: params.token
        })

        return result.deletedCount > 0
    }

}