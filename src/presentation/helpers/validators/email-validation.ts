import { Validator } from './validator'
import { EmailValidator } from '../../protocols'
import { InvalidParamError } from '../../errors'

export class EmailValidation implements Validator {
    private readonly emailFieldName: string
    private readonly emailValidator: EmailValidator

    constructor(emailFieldName: string, emailValidator: EmailValidator) {
        this.emailValidator = emailValidator
        this.emailFieldName = emailFieldName
    }
    validate(input: any): Error {
        if(!this.emailValidator.isValid(input[this.emailFieldName])) {
            return new InvalidParamError(this.emailFieldName)
        }
    }
}