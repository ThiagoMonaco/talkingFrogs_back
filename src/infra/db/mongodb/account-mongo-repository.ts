import { AddAccountRepository } from '@data/protocols/db/account/add-account-repository'
import { CheckAccountByEmailRepository } from '@data/protocols/db/account/check-account-by-email-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '@data/protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '@domain/models/account'
import { AddQuestionRepository } from '@data/protocols/db/question/add-question-repository'
import { ObjectId } from 'mongodb'
import { CheckAccountByNameRepository } from '@data/protocols/db/account/check-account-by-name-repository'
import { AnswerQuestionRepository } from '@data/protocols/db/question/answer-question-repository'

export class AccountMongoRepository implements
    AddAccountRepository,
    CheckAccountByEmailRepository,
    CheckAccountByNameRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    LoadAccountByTokenRepository,
    AddQuestionRepository,
    AnswerQuestionRepository {

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

    async checkByName(name: string): Promise<CheckAccountByNameRepository.Result> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ name })
        return !!account
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

    async loadByToken(token: string): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({
            accessToken: token
        })

        if(!account) {
            return null
        }

        return MongoHelper.mapId(account)
    }

    async addQuestion(params: AddQuestionRepository.Params): Promise<AddQuestionRepository.Result> {
        const { question, accountName } = params
        const accountCollection = MongoHelper.getCollection('accounts')
        const questionId = new ObjectId()

        const result = await accountCollection.updateOne({
            name: accountName
        },
            {
                $push: {
                    questions: {
                        question: question,
                        questionId: questionId,
                        answer: null
                    }
                }
        })

        if(result.modifiedCount === 0) {
            return null
        }

        return {
            questionId: questionId.toString()
        }
    }

    async answerQuestion (data: AnswerQuestionRepository.Params): Promise<AnswerQuestionRepository.Result> {
        const { questionId, answer, accountId } = data
        const accountCollection = MongoHelper.getCollection('accounts')
        const parsedId = MongoHelper.parseToObjectId(accountId)

        const result = await accountCollection.updateOne({
            _id: parsedId,
            'questions.questionId': MongoHelper.parseToObjectId(questionId)
        }, {
            $set: {
                'questions.$.answer': answer
            }
        })

        return result.modifiedCount > 0
    }
}
