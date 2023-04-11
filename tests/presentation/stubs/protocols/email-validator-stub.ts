import { EmailValidator } from '@presentation/protocols'

export class EmailValidatorStub implements EmailValidator {
    result = true
    isValid(email: string): boolean {
        return this.result
    }
}