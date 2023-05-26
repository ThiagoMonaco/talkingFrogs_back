import { NotBlankFieldValidation, Validator, ValidatorComposite } from '@presentation/helpers/validators'

export const makeAnswerQuestionValidation = (): ValidatorComposite => {
    const validations: Validator[] = []

    const requiredFields = ['questionId', 'answer']
    for (const field of requiredFields) {
        validations.push(new NotBlankFieldValidation(field))
    }

    return new ValidatorComposite(validations)
}