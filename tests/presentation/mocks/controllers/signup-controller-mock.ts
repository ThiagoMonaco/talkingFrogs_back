import { SignUpController } from '@presentation/controllers/signup-controller'
import { faker } from '@faker-js/faker'

export const mockSignUpControllerRequest = (): SignUpController.Request => {
    const password = faker.internet.password()
    return {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
    }
}