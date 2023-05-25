import {
    NotBlankFieldValidation,
    Validator,
    ValidatorComposite
} from '@presentation/helpers/validators'

export const makeAskQuestionValidation = (): ValidatorComposite => {
    const validations: Validator[] = []

    const requiredFields = ['accountName', 'question']
    for (const field of requiredFields) {
        validations.push(new NotBlankFieldValidation(field))
    }

    return new ValidatorComposite(validations)
}