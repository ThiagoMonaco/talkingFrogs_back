import { AnswerQuestionRepository } from '@data/protocols/db/question/answer-question-repository'
import { AddQuestionRepository } from '@data/protocols/db/question/add-question-repository'
import { RemoveQuestionRepository } from '@data/protocols/db/question/remove-question-repository'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { ObjectId } from 'mongodb'

export class QuestionMongoRepository implements
    AddQuestionRepository,
    AnswerQuestionRepository,
    RemoveQuestionRepository {
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

    async removeQuestion (data: RemoveQuestionRepository.Params) {
        const { questionId, accountId } = data
        const accountCollection = MongoHelper.getCollection('accounts')
        const parsedId = MongoHelper.parseToObjectId(accountId)

        const result = await accountCollection.updateOne({
            _id: parsedId
        }, {
            $pull: {
                questions: {
                    questionId: MongoHelper.parseToObjectId(questionId)
                }
            }
        })

        return result.modifiedCount > 0
    }
}