import { MissingParamError } from '@presentation/errors/missing-param-error'
import { Validator } from '@presentation/helpers/validators/validator'
import { ValidatorComposite } from '@presentation/helpers/validators/validator-composite'
import { ValidationStub } from '@tests/presentation/stubs/helpers/validation-stub'

interface SutTypes {
    sut: Validator,
    validationStubs: ValidationStub []
}

const makeSut = (): SutTypes => {
    const validationStubs = [new ValidationStub(), new ValidationStub()]
    const sut = new ValidatorComposite(validationStubs)
    return {
        sut,
        validationStubs
    }
}


describe('Validation Composite', function () {
    test('Should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut()
        validationStubs[0].result = new MissingParamError('field')

        const response = sut.validate({
            email: 'test@mail.com'
        })

        expect(response).toEqual(new MissingParamError('field'))
    })

    test('Should return the first error if more than one validation fails', () => {
        const { sut, validationStubs } = makeSut()
        validationStubs[0].result = new Error()
        validationStubs[1].result = new MissingParamError('field')

        const response = sut.validate({
            email: 'test@mail.com'
        })

        expect(response).toEqual(new Error())
    })

    test('Should return anything if validation success', () => {
        const { sut } = makeSut()

        const response = sut.validate({
            email: 'test@mail.com'
        })

        expect(response).toBeFalsy()
    })
})