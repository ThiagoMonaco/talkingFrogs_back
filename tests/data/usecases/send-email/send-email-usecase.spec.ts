import { SendEmailUsecase } from '@data/usecases/send-email-usecase'
import { EmailSenderStub } from '@tests/data/stubs/email-sender-stub'
import { faker } from '@faker-js/faker'
import { SendEmail } from '@domain/usecases/send-email'

interface SutTypes {
    sut: SendEmailUsecase
    emailSenderStub: EmailSenderStub
}

const makeSut = (): SutTypes => {
    const emailSenderStub = new EmailSenderStub()
    const sut = new SendEmailUsecase(emailSenderStub)
    return {
        sut,
        emailSenderStub
    }
}

const mockParams = (): SendEmail.Params => ({
    to: faker.internet.email(),
    subject: faker.lorem.sentence(),
    text: faker.lorem.paragraph()
})

describe('Send Email UseCase', () => {
    test('Should call SendEmail with correct values', async () => {
        const { sut, emailSenderStub } = makeSut()
        const sendEmailSpy = jest.spyOn(emailSenderStub, 'sendEmail')
        const params = mockParams()

        await sut.sendEmail(params)

        expect(sendEmailSpy).toHaveBeenCalledWith(params)
    })

    test('Should throw if SendEmail throws', async () => {
        const { sut, emailSenderStub } = makeSut()
        jest.spyOn(emailSenderStub, 'sendEmail').mockImplementationOnce(() => {
            throw new Error()
        })
        const params = mockParams()

        const promise = sut.sendEmail(params)

        await expect(promise).rejects.toThrow()
    })
})