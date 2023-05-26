import { DbRemoveQuestion } from '@data/usecases/db-remove-question'
import { RemoveQuestionRepositoryStub } from '@tests/data/mocks/remove-question-repository-stub'
import { RemoveQuestion } from '@domain/usecases/remove-question'
import { faker } from '@faker-js/faker'

interface SutTypes {
    sut: DbRemoveQuestion
    removeQuestionRepositoryStub: RemoveQuestionRepositoryStub
}

const makeSut = (): SutTypes => {
    const removeQuestionRepositoryStub = new RemoveQuestionRepositoryStub()
    const sut = new DbRemoveQuestion(removeQuestionRepositoryStub)
    return {
        sut,
        removeQuestionRepositoryStub
    }
}

const mockParams = (): RemoveQuestion.Params => ({
    questionId: faker.datatype.uuid(),
    accountId: faker.datatype.uuid()
})

describe('DbRemoveQuestion', () => {
    test('Should call RemoveQuestionRepository with correct values', async () => {
        const { removeQuestionRepositoryStub, sut } = makeSut()
        const removeQuestionSpy = jest.spyOn(removeQuestionRepositoryStub, 'removeQuestion')
        const params = mockParams()

        await sut.removeQuestion(params)

        expect(removeQuestionSpy).toHaveBeenCalledWith(params)
    })

    test('Should throw if RemoveQuestionRepository throws', async () => {
        const { removeQuestionRepositoryStub, sut } = makeSut()
        jest.spyOn(removeQuestionRepositoryStub, 'removeQuestion').mockImplementationOnce(() => {
            throw new Error()
        })

        const promise = sut.removeQuestion(mockParams())

        await expect(promise).rejects.toThrow()
    })

    test('Should return false if RemoveQuestionRepository returns false', async () => {
        const { removeQuestionRepositoryStub, sut } = makeSut()
        removeQuestionRepositoryStub.result = false

        const result = await sut.removeQuestion(mockParams())

        expect(result).toBeFalsy()
    })

    test('Should return true if RemoveQuestionRepository returns true', async () => {
        const { sut } = makeSut()

        const result = await sut.removeQuestion(mockParams())

        expect(result).toBeTruthy()
    })
})