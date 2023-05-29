import { SendEmail } from '@domain/usecases/send-email'

export class SendEmailStub implements SendEmail {
    async sendEmail(params: SendEmail.Params): Promise<SendEmail.Result> {
        return Promise.resolve()
    }
}