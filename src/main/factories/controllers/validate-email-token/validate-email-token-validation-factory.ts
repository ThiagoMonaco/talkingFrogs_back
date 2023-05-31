import {
    NotBlankFieldValidation,
    Validator,
    ValidatorComposite
} from '@presentation/helpers/validators'
export const makeValidateEmailTokenValidation = (): ValidatorComposite => {
    const validations: Validator[] = []

    const requiredFields = ['token', 'accountEmail', 'accountId']
    for (const field of requiredFields) {
        validations.push(new NotBlankFieldValidation(field))
    }

    return new ValidatorComposite(validations)
}