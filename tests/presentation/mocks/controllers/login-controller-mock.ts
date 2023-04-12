import { LoginController } from '@presentation/controllers/login-controller'
import { faker } from '@faker-js/faker'

export const mockLoginControllerRequest = (): LoginController.Request => ({
    email: faker.internet.email(),
    password: faker.internet.password()
})