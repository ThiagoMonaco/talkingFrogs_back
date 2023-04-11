import { Validator } from './validator'
import { MissingParamError } from '../../errors'


export class RequiredFieldValidation implements Validator {
    private readonly requiredField: string

    constructor(requiredField: string) {
        this.requiredField = requiredField
    }

    validate(input: any): Error {
        const value = input[this.requiredField]
        if(value === undefined || value === null) {
            return new MissingParamError(this.requiredField)
        }
    }
}