import { AnswerQuestionRepositoryStub } from '@tests/data/stubs/answer-question-repository-stub'
import { DbAnswerQuestion } from '@data/usecases/db-answer-question'
import { mockAnswerQuestionRequest } from '@tests/data/mocks/answer-question-mock'

interface SutTypes {
    sut: DbAnswerQuestion
    answerQuestionRepositoryStub: AnswerQuestionRepositoryStub
}

const makeSut = (): SutTypes => {
    const answerQuestionRepositoryStub = new AnswerQuestionRepositoryStub()
    const sut = new DbAnswerQuestion(answerQuestionRepositoryStub)
    return {
        sut,
        answerQuestionRepositoryStub
    }
}

describe('DbAnswerQuestion Usecase', () => {

    test('Should call AnswerQuestionRepository with correct values', async () => {
        const { sut, answerQuestionRepositoryStub } = makeSut()
        const answerSpy = jest.spyOn(answerQuestionRepositoryStub, 'answerQuestion')
        const params = mockAnswerQuestionRequest()

        await sut.answer(params)

        expect(answerSpy).toHaveBeenCalledWith(params)
    })

    test('Should throw if AnswerQuestionRepository throws', async () => {
        const { sut, answerQuestionRepositoryStub } = makeSut()
        jest.spyOn(answerQuestionRepositoryStub, 'answerQuestion').mockImplementationOnce(() => { throw new Error() })

        const promise = sut.answer(mockAnswerQuestionRequest())

        await expect(promise).rejects.toThrow()
    })

    test('Should return true on success', async () => {
        const { sut } = makeSut()
        const params = mockAnswerQuestionRequest()

        const result = await sut.answer(params)

        expect(result).toBe(true)
    })

    test('Should return false if AnswerQuestionRepository returns false', async () => {
        const { sut, answerQuestionRepositoryStub } = makeSut()
        answerQuestionRepositoryStub.result = false
        const params = mockAnswerQuestionRequest()

        const result = await sut.answer(params)

        expect(result).toBe(false)
    })
})