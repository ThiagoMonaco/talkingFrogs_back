import { InvalidParamError } from '@presentation/errors'
import { CompareFieldValidation } from '@presentation/helpers/validators'

describe('CompareFieldValidation',  () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = new CompareFieldValidation('password', 'confirmPassword')
        const error = sut.validate({ password: 'test', confirmPassword: 'testing' })
        expect(error).toEqual(new InvalidParamError('confirmPassword'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = new CompareFieldValidation('password', 'confirmPassword')
        const error = sut.validate({ password: 'test', confirmPassword: 'test' })
        expect(error).toBeFalsy()
    })
})