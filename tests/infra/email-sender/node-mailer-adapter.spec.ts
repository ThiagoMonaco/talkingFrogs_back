import { NodeMailerAdapter } from '@infra/email-sender/node-mailer/node-mailer-adapter'
import { nodeMailerHelper } from '@infra/email-sender/node-mailer/helpers/node-mailer-helper'
import { faker } from '@faker-js/faker'

describe('NodeMailerAdapter', () => {
    beforeAll(async () => {
        jest.spyOn(nodeMailerHelper, 'sendEmail').mockImplementationOnce(async () => {
            return null
        })
    })

    test('Should call sendEmail with correct params', async () => {
        const sut = new NodeMailerAdapter()
        const sendEmailSpy = jest.spyOn(nodeMailerHelper, 'sendEmail')
        const params = {
            to: faker.internet.email(),
            subject: faker.lorem.sentence(),
            text: faker.lorem.paragraph()
        }
        await sut.sendEmail({
            to: params.to,
            subject: params.subject,
            text: params.text
        })

        expect(sendEmailSpy).toHaveBeenCalledWith(params.to, params.subject, params.text)
    })
})