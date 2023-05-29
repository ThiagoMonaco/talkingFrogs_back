import { EmailSender } from '@data/protocols/email/email-sender'
import { nodeMailerHelper } from '@infra/email-sender/node-mailer/helpers/node-mailer-helper'

export class NodeMailerAdapter implements EmailSender {
    async sendEmail(params: EmailSender.Params): Promise<EmailSender.Result> {
        await nodeMailerHelper.sendEmail(params.to, params.subject, params.text)
    }
}