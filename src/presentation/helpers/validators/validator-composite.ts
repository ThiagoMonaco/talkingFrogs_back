import { Validator } from '@presentation/helpers/validators/validator'

export class ValidatorComposite implements Validator {
    constructor(private readonly validations: Validator[]) {}

    validate(input: any): Error {
        for(const validation of this.validations) {
            const error = validation.validate(input)
            if(error) {
                return error
            }
        }
        return null
    }
}