import { NotBlankFieldValidation } from '@presentation/helpers/validators'
import { InvalidParamError, MissingParamError } from '@presentation/errors'

describe('not blank field validation',  () => {
    test('Should return a MissingParamError if validation fails on missing param', () => {
        const sut = new NotBlankFieldValidation('field')
        const error = sut.validate({ name: '' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should return a MissingParamError if validation fails on blank value', () => {
        const sut = new NotBlankFieldValidation('field')
        const error = sut.validate({ field: '' })
        expect(error).toEqual(new InvalidParamError('field'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = new NotBlankFieldValidation('field')
        const error = sut.validate({ field: 'test' })
        expect(error).toBeFalsy()
    })
})