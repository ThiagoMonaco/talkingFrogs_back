import { CheckEmailExists } from '@domain/usecases/check-email-exists'

export class CheckEmailExistsStub implements CheckEmailExists {
	result = true
	async checkEmailExists(email) {
		return this.result
	}
}