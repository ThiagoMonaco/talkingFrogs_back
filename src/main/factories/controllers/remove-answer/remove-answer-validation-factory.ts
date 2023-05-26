import { NotBlankFieldValidation, Validator, ValidatorComposite } from '@presentation/helpers/validators'

export const makeRemoveAnswerValidation = (): ValidatorComposite => {
    const validations: Validator[] = []

    const requiredFields = ['questionId', 'accountId']
    for (const field of requiredFields) {
        validations.push(new NotBlankFieldValidation(field))
    }

    return new ValidatorComposite(validations)
}