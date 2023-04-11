import { RequiredFieldValidation } from '@presentation/helpers/validators'
import { MissingParamError } from '@presentation/errors'

describe('RequiredFieldValidation',  () => {
    test('Should return a MissingParamError if validation fails', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ name: 'test' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should not return if validation succeeds', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ field: 'test' })
        expect(error).toBeFalsy()
    })
})