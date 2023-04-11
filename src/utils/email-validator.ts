import { EmailValidator } from '@presentation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
    isValid (email: string): boolean {
        const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
        return EMAIL_REGEX.test(email)
    }
}