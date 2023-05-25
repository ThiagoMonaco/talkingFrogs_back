import { AddQuestionRepository } from '@data/protocols/db/account/add-question-repository'
import { faker } from '@faker-js/faker'

export class AddQuestionRepositoryStub implements AddQuestionRepository {
    result = {
        questionId: faker.datatype.uuid()
    }
    async addQuestion(params) {
        return this.result
    }
}