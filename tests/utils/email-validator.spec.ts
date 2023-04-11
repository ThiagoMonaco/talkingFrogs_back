import { EmailValidatorAdapter } from '@utils/email-validator'

describe('EmailValidatorAdapter', function () {
    test('should return false if validator rejects the email', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalidmail.com')
        expect(isValid).toBe(false)
    })

    test('should return true if validator accepts the email', () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('valid@mail.com')
        expect(isValid).toBe(true)
    })

    test('should call with correct email', () => {
        const sut = new EmailValidatorAdapter()
        const isValidSpy = jest.spyOn(sut, 'isValid')
        sut.isValid('valid@mail.com')
        expect(isValidSpy).toHaveBeenCalledWith('valid@mail.com')
    })
})