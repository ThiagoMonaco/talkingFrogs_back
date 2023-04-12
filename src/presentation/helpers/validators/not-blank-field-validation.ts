import { Validator } from './validator'
import { InvalidParamError, MissingParamError } from '../../errors'


export class NotBlankFieldValidation implements Validator {
    private readonly requiredField: string

    constructor(requiredField: string) {
        this.requiredField = requiredField
    }

    validate(input: any): Error {
        const value = input[this.requiredField]
        if(value === undefined || value === null) {
            return new MissingParamError(this.requiredField)
        }

        if(value === '') {
            return new InvalidParamError(this.requiredField)
        }
    }
}