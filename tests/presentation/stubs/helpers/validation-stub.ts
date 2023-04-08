import { Validator } from '@presentation/helpers/validators/validator'

export class ValidationStub implements Validator {
    result = null
    input: any
    validate(input: any): Error {
        this.input = input
        return this.result
    }
}