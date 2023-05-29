import { SendEmail } from '@domain/usecases/send-email'
import { EmailSender } from '@data/protocols/email/email-sender'

export class SendEmailUsecase implements SendEmail {

    constructor(private readonly emailSender: EmailSender) {}
    async sendEmail(params: SendEmail.Params): Promise<SendEmail.Result> {
        await this.emailSender.sendEmail(params)
    }

}