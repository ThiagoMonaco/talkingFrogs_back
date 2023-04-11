import {
    ValidatorComposite,
    RequiredFieldValidation,
    CompareFieldValidation,
    EmailValidation
} from '@presentation/helpers/validators'
import { Validator } from '@presentation/helpers/validators/validator'
import { EmailValidatorAdapter } from '@utils/email-validator'

export const makeSignUpValidation = (): ValidatorComposite => {
    const validations: Validator[] = []

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
        validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
    const emailValidatorAdapter = new EmailValidatorAdapter()
    validations.push(new EmailValidation('email', emailValidatorAdapter))
    return new ValidatorComposite(validations)
}