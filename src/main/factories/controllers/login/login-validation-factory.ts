import { ValidatorComposite, EmailValidation, NotBlankFieldValidation } from '@presentation/helpers/validators'
import { Validator } from '@presentation/helpers/validators/validator'
import { EmailValidatorAdapter } from '@utils/email-validator'

export const makeLoginValidation = (): ValidatorComposite => {
    const validations: Validator[] = []

    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
        validations.push(new NotBlankFieldValidation(field))
    }

    const emailValidatorAdapter = new EmailValidatorAdapter()
    validations.push(new EmailValidation('email', emailValidatorAdapter))
    return new ValidatorComposite(validations)
}