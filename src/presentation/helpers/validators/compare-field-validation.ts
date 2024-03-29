import { Validator } from './validator'
import { InvalidParamError } from '../../errors'

export class CompareFieldValidation implements Validator {
    private readonly fieldName: string
    private readonly fieldToCompare: string

    constructor(fieldName: string, fieldToCompare: string) {
        this.fieldName = fieldName
        this.fieldToCompare = fieldToCompare
    }

    validate(input: any): Error {
        if(input[this.fieldName] !== input[this.fieldToCompare]) {
            return new InvalidParamError(this.fieldToCompare)
        }
    }
}