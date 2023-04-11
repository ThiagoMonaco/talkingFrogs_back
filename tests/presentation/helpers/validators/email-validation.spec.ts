import { EmailValidation } from '@presentation/helpers/validators'
import { InvalidParamError } from '@presentation/errors'
import { EmailValidatorStub } from '@tests/presentation/stubs/protocols/email-validator-stub'

interface SutTypes {
    sut: EmailValidation,
    emailValidatorStub: EmailValidatorStub
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new EmailValidation('email', emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}


describe('Email Validation', () => {
    test('Should call EmailValidator with correct values', () => {
        const { sut, emailValidatorStub } = makeSut()
        const spy = jest.spyOn(emailValidatorStub, 'isValid')

        sut.validate({
            email: 'test@mail.com'
        })

        expect(spy).toHaveBeenCalledWith('test@mail.com')
    })

    test('Should throw if emailValidator throws an error', () => {
        const { sut, emailValidatorStub } = makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        expect(sut.validate).toThrow()
    })

    test('Should return an error emailValidator return false', () => {
        const { sut, emailValidatorStub } = makeSut()
        emailValidatorStub.result = false

        const response = sut.validate({ email: 'test@mail.com' })

        expect(response).toEqual(new InvalidParamError('email'))
    })
})