import {
	EmailValidation,
	NotBlankFieldValidation,
	Validator,
	ValidatorComposite
} from '@presentation/helpers/validators'

export const makeGetUserDataValidation = (): ValidatorComposite => {
	const validations: Validator[] = []

	const requiredFields = ['username']
	for (const field of requiredFields) {
		validations.push(new NotBlankFieldValidation(field))
	}
	
	return new ValidatorComposite(validations)
}