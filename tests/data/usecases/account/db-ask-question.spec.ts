import { AskQuestion } from '@domain/usecases/ask-question'
import { AddQuestionRepositoryStub } from '@tests/data/stubs/add-question-repository-stub'
import { DbAskQuestion } from '@data/usecases/db-ask-question'
import { mockAskQuestionParams } from '@tests/data/mocks/ask-question-mock'

interface SutTypes {
    sut: AskQuestion
    addQuestionRepositoryStub: AddQuestionRepositoryStub
}

const makeSut = (): SutTypes => {
    const addQuestionRepositoryStub = new AddQuestionRepositoryStub()
    const sut = new DbAskQuestion(addQuestionRepositoryStub)
    return {
        sut,
        addQuestionRepositoryStub
    }
}

describe('DbAskQuestion Usecase', () => {

    test('Should call AddQuestionRepository with correct values', async () => {
        const { sut, addQuestionRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(addQuestionRepositoryStub, 'add')
        const params = mockAskQuestionParams()

        await sut.ask(params)

        expect(addSpy).toHaveBeenCalledWith(params)
    })

    test('Should throw if AddQuestionRepository throws', async () => {
        const { sut, addQuestionRepositoryStub } = makeSut()
        jest.spyOn(addQuestionRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

        const promise = sut.ask(mockAskQuestionParams())

        await expect(promise).rejects.toThrow()
    })

    test('Should return a questionId on success', async () => {
        const { sut, addQuestionRepositoryStub } = makeSut()
        const params = mockAskQuestionParams()

        const questionId = await sut.ask(params)

        expect(questionId).toEqual(addQuestionRepositoryStub.result)
    })
})