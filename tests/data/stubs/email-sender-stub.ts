import { EmailSender } from '@data/protocols/email/email-sender'

export class EmailSenderStub implements EmailSender {
    async sendEmail(params: EmailSender.Params): Promise<EmailSender.Result> {
        return Promise.resolve(undefined)
    }

}