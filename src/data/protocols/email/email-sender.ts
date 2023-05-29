export interface EmailSender {
    sendEmail(params: EmailSender.Params): Promise<EmailSender.Result>
}

export namespace EmailSender {
    export type Params = {
        to: string
        subject: string
        text: string
    }

    export type Result = void
}